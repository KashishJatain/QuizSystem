const jwt=require("jsonwebtoken");
const User=require("../Model/userModel");
const crypto = require('crypto');
const { sendVerificationEmail } = require('../utils/emailService');
const Result = require("../Model/resultModel");
const bcrypt=require("bcrypt");
const registerUser=async (req,res)=>{
    try {
        const {name,email,password,isAdmin}=req.body;
        const saltRounds=5;
        const user=await User.findOne({email});
        if(user) {
        return res.status(200).send({message:"Already exists",error:false});}
        else{
        const verificationToken = crypto.randomBytes(32).toString('hex');
        bcrypt.hash(password, saltRounds,async (err, hashed_password) =>{
            if(err){       
             res.status(500).send({message:err.message,error:true});
              }
            else {
                const user= await new User({name,
                    email,
                    password: hashed_password,
                    isAdmin,
                    verificationToken,
                    isVerified: false});
                user.save();
                try {
                    await sendVerificationEmail(email, verificationToken);
                    res.status(200).send({ 
                        message: "Registration successful. Please check your email to verify your account.", 
                        error: false 
                    });
                } catch (emailError) {
                    await User.findByIdAndDelete(user._id);
                    res.status(500).send({ 
                        message: "Failed to send verification email", 
                        error: true 
                    });
                }
            }
        });
    }
    } catch (error) {
        res.status(500).send({message:error.message,error:true});
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(404).send({ 
                message: "Invalid verification token", 
                error: true 
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).send({ 
            message: "Email verified successfully", 
            error: false 
        });
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: error.message, error: true });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            if (!user.isVerified) {
                return res.status(401).send({ 
                    message: "Please verify your email before logging in", 
                    error: true 
                });
            }
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    const token = jwt.sign(
                        { 
                            email: user.email,
                            _id: user._id 
                        },
                        process.env.SECRET_KEY
                    );
                    
                    const { password, ...other } = user._doc;
                    let cookieOptions = {
                        httpOnly: false,
                        maxAge: 900000,
                        origin: "http://localhost:5173/",
                        sameSite: 'none',
                        secure: true
                    }
                    
                    res.cookie('access_token', token, cookieOptions)
                    res.status(200).send({ message: { ...other, isAdmin: user.isAdmin }, error: false });
                } else {
                    res.status(401).send({ message: "Invalid credential", error: true })
                }
            });
        } else {
            res.status(401).send({ message: "Please create account.", error: true })
        }
    } catch (error) {
        res.status(500).send({ message: error.message, error: true })
    }
}
const getUser=async (req,res)=>{
try {
    const user=await User.findOne({_id:req.params.id});
    const {password,isAdmin,...other}=user._doc;
    res.status(200).send({message:{...other,isAdmin},error:false})
} catch (error) {
    res.status(500).send({message:error.message,error:true})  
}
}
const getAllUser=async (req,res)=>{
try {
    const {filterby,sortby,page,limit}=req.query;
    const sortval=sortby==="asc"?1:-1
    const count=await User.countDocuments();
    let users;
    if(filterby==="both"){
     users=await User.find({}).sort({createdAt:sortval}).skip((page-1)*limit).limit(limit);
    }
    else {
        const filterval=filterby==="user"?false:true
    users=await User.find({isAdmin:filterval}).sort({createdAt:sortval}).skip((page-1)*limit).limit(limit);
    }
    res.status(200).send({message:users,count,error:false})
} catch (error) {
    res.status(500).send({message:error.message,error:true})  
}
}
const updateUser=async (req,res)=>{
try {
    await User.findByIdAndUpdate({_id:req.params.id},{$set:req.body});
    res.status(200).send({message:"updated",error:false})
} catch (error) {
    res.status(500).send({message:error.message,error:true})  
}
}
const deleteUser = async (req, res) => {
    try {
        const userToDelete = await User.findById(req.params.id);
        if (!userToDelete) {
            return res.status(404).send({
                message: "User not found",
                error: true
            });
        }
        await User.findByIdAndDelete(req.params.id);
        await Result.findByIdAndDelete(req.params.id);
        
        res.status(200).send({
            message: "Deleted",
            error: false
        });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).send({
            message: "Error deleting user",
            error: true
        });
    }
}


module.exports={ registerUser, verifyEmail, loginUser, getUser, getAllUser, updateUser, deleteUser};