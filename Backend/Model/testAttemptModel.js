const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    questionText: { type: String, required: true },
    questionImage: { type: String, required: false },
    correctAnswer: { type: String, required: true },
    userAnswer: { type: String },
    isCorrect: { type: Boolean, required: true },
    score: { type: Number, required: true }
}, { _id: false });

const testAttemptSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    level: { type: String, required: true },
    type: { type: String, required: true },
    questions: [questionSchema],
    totalScore: { type: Number, required: true },
    maxMarks: { type: Number, required: true },
    timeTaken: { type: Number },
    completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const TestAttempt = mongoose.model("TestAttempt", testAttemptSchema);
module.exports = TestAttempt;