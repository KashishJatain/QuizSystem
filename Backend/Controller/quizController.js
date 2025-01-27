const Quiz = require("../Model/quizModel")
const User=require("../Model/userModel");

const upload = require("../config/multer.config");

const postQuestion = async (req, res) => {
    try {
        const questionData = req.body;
        if (req.file) {
            questionData.image = `/uploads/${req.file.filename}`;
        }
        
        if (questionData.type === 'numerical' && (!questionData.tolerance)) {
            return res.status(400).send({
                message: "Numerical questions require unit and tolerance values",
                error: true
            });
        }
        
        if (questionData.type === 'mcq' && (!questionData.option || questionData.option.length === 0)) {
            return res.status(400).send({
                message: "MCQ questions require options",
                error: true
            });
        }

        const question = await new Quiz(questionData);
        await question.save();
        res.status(200).send({ message: "Question Posted", error: false });
    } catch (error) {
        res.status(500).send({ message: error.message, error: true });
    }
};
const getQuestionCounts = async (req, res) => {
    try {
        const totalQuestions = {
            Physics: {
                mcq: await Quiz.countDocuments({ section: 'Physics', type: 'mcq' }),
                numerical: await Quiz.countDocuments({ section: 'Physics', type: 'numerical' })
            },
            Chemistry: {
                mcq: await Quiz.countDocuments({ section: 'Chemistry', type: 'mcq' }),
                numerical: await Quiz.countDocuments({ section: 'Chemistry', type: 'numerical' })
            },
            Maths: {
                mcq: await Quiz.countDocuments({ section: 'Maths', type: 'mcq' }),
                numerical: await Quiz.countDocuments({ section: 'Maths', type: 'numerical' })
            }
        };
        
        const total = Object.values(totalQuestions).reduce((acc, section) => 
            acc + Object.values(section).reduce((a, b) => a + b, 0), 0);
            
        res.status(200).send({ 
            message: { counts: totalQuestions, total }, 
            error: false 
        });
    } catch (error) {
        res.status(500).send({ message: error.message, error: true });
    }
};

const getQuestions = async (req, res) => {
    try {
        const { level = 'medium', limit = 75, offset = 0 } = req.query;
        
        const questionsPerSection = Math.floor(limit / 3);
        const mcqPerSection = Math.ceil(questionsPerSection * 0.8);
        const numericalPerSection = questionsPerSection - mcqPerSection; 
        
        const physicsQuestions = {
            mcq: await Quiz.find({ section: 'Physics', type: 'mcq', level:level.toLowerCase() }).skip(offset * mcqPerSection).limit(mcqPerSection),
            numerical: await Quiz.find({ section: 'Physics', type: 'numerical', level:level.toLowerCase() }).skip(offset * numericalPerSection).limit(numericalPerSection)
        };
        
        const chemistryQuestions = {
            mcq: await Quiz.find({ section: 'Chemistry', level:level.toLowerCase(), type: 'mcq' }).skip(offset * mcqPerSection).limit(mcqPerSection),
            numerical: await Quiz.find({ section: 'Chemistry', level:level.toLowerCase(), type: 'numerical' }).skip(offset * numericalPerSection).limit(numericalPerSection)
        };
        
        const mathsQuestions = {
            mcq: await Quiz.find({ section: 'Maths', level:level.toLowerCase(), type: 'mcq' }).skip(offset * mcqPerSection).limit(mcqPerSection),
            numerical: await Quiz.find({ section: 'Maths', level:level.toLowerCase(), type: 'numerical' }).skip(offset * numericalPerSection).limit(numericalPerSection)
        };
        
        const questions = {
            Physics: physicsQuestions,
            Chemistry: chemistryQuestions,
            Maths: mathsQuestions
        };
        
        res.status(200).send({ message: questions, error: false });
    } catch (error) {
        res.status(500).send({ message: error.message, error: true });
    }
};
const getQuestionById=async (req,res)=>{
    try {
        const question=await Quiz.findById(req.params.id);
        res.status(200).send({message:question,error:false});
    } catch (error) {
        res.status(500).send({message:error.message,error:true})
    }
}
const getAllQuestions = async (req, res) => {
    try {
        const { section, type, level, sortby, page = 1, limit = 10 } = req.query;
        const sortval = sortby === "asc" ? 1 : -1;

        let query = {};
        if (type && type !== "all") {
            query.type = type;
        }
        if (level && level !== "all") {
            query.level = level;
        }
        if (section && section !== "all") {
            query.section = section;
        }

        const count = await Quiz.countDocuments(query); 
        const questions = await Quiz.find(query)
            .sort({ createdAt: sortval })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).send({ message: questions, count, error: false });
    } catch (error) {
        res.status(500).send({ message: error.message, error: true });
    }
};
const updateQuestion=async (req,res)=>{
    try{
        await Quiz.findByIdAndUpdate({_id:req.params.id},{$set:req.body});
        res.status(200).send({message:"Updated",error:false});
    }catch (error) {
        res.status(500).send({message:error.message,error:true})
    }
}
const deleteQuestion=async (req,res)=>{
    try{
        await Quiz.findByIdAndDelete(req.params.id);
        res.status(200).send({message:"Deleted",error:false});
    }catch (error) {
        res.status(500).send({message:error.message,error:true})
    }
}

const addBookmark = async (req, res) => {
  try {
      const { questionId } = req.params;
      const user = req.user;

      if (!user) {
          return res.status(401).send({ message: "User not found", error: true });
      }

      if (user.isAdmin) {
          return res.status(403).send({ message: "Admins cannot bookmark questions", error: true });
      }

      if (!user.bookmarks.includes(questionId)) {
          user.bookmarks.push(questionId);
          await user.save();
          return res.status(200).send({ message: "Question bookmarked", error: false });
      } else {
          return res.status(400).send({ message: "Question already bookmarked", error: true });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Server error", error: true });
  }
};

const removeBookmark = async (req, res) => {
  try {
      const { questionId } = req.params;
      const user = req.user;

      if (!user) {
          return res.status(401).send({ message: "User not found", error: true });
      }

      if (user.isAdmin) {
          return res.status(403).send({ message: "Admins cannot manage bookmarks", error: true });
      }

      if (user.bookmarks.includes(questionId)) {
          user.bookmarks = user.bookmarks.filter((id) => id.toString() !== questionId);
          await user.save();
          return res.status(200).send({ message: "Question unbookmarked", error: false });
      } else {
          return res.status(400).send({ message: "Question not bookmarked", error: true });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Server error", error: true });
  }
};
  
  const getBookmarkedQuestions = async (req, res) => {
    try {
      const user = req.user;
      const bookmarkedQuestions = await Quiz.find({ _id: { $in: user.bookmarks } });
      return res.status(200).send({ message: bookmarkedQuestions, error: false });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Server error", error: true });
    }
  };
    
module.exports={postQuestion,getQuestionCounts,getQuestions,getQuestionById,getAllQuestions,updateQuestion,deleteQuestion,addBookmark, removeBookmark, getBookmarkedQuestions };



