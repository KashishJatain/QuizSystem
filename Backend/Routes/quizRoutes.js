const express=require("express");
const { postQuestion, getQuestionCounts, getQuestions, updateQuestion, deleteQuestion, getAllQuestions, getQuestionById, addBookmark, removeBookmark, getBookmarkedQuestions } = require("../Controller/quizController");
const upload=require("../config/multer.config");
const { authmiddleware } = require("../Middleware/authmiddleware");
const app=express.Router();
app.use(authmiddleware);
app.post("/", upload.single('image'),postQuestion)
app.get("/",getQuestions)
app.get("/counts",getQuestionCounts)
app.get("/all",getAllQuestions)
app.get("/question/:id",getQuestionById)
app.patch("/:id",updateQuestion)
app.delete("/:id",deleteQuestion)

app.post("/bookmark/:questionId",  addBookmark);
app.delete("/bookmark/:questionId", removeBookmark);
app.get("/bookmark",  getBookmarkedQuestions);

module.exports=app;