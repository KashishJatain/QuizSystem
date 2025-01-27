const Notice = require('../Model/noticeModel'); 

const postNotice=async (req,res)=>{
    try {
        const notice=await new Notice(req.body);
        notice.save();
        res.status(200).send({message:"Notice Posted",error:false})
    } catch (error) {
        res.status(500).send({message:error.message,error:true})
    }};

const getNotices= async (req, res) => {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 });
        res.status(200).send({message:notices,error:false})
} catch (error) {
    res.status(500).send({message:error.message,error:true})  
}
};

const deleteNotice=async(req,res)=>{
    try{
        await Notice.findByIdAndDelete(req.params.id);
        res.status(200).send({message:"Deleted",error:false});
    }catch (error) {
        res.status(500).send({message:error.message,error:true})
    }
};
module.exports={postNotice,getNotices,deleteNotice};

