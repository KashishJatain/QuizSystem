const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    isAdmin:{type:Boolean,required:true,default:false},
    image:{type:String},
    bookmarks: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Quiz",
        },
      ],
},{timestamps:true})
const User=mongoose.model("user",userSchema);
module.exports=User;