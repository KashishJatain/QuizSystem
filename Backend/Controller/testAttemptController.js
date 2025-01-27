const TestAttempt = require('../Model/testAttemptModel');
const Quiz = require('../Model/quizModel');
const Result = require('../Model/resultModel');
const mongoose = require('mongoose');

const saveTestAttempt = async (req, res) => {
    try {
        const {
            userId,
            level,
            type,
            questions,
            totalScore,
            maxMarks,
            timeTaken
        } = req.body;

        const testAttempt = new TestAttempt({
            userId,
            level,
            type: type || 'mcq',
            questions: questions.map(q => ({
                questionId: q.questionId,
                questionText: q.questionText,
                questionImage: q.questionImage,
                correctAnswer: q.correctAnswer,
                userAnswer: q.userAnswer,
                isCorrect: q.userAnswer === q.correctAnswer,
                score: q.userAnswer === q.correctAnswer ? 4 : 0
            })),
            totalScore,
            maxMarks,
            timeTaken
        });

        await testAttempt.save();

        const result = new Result({
            userId,
            type: type || 'mcq',
            level,
            score: totalScore,
            mm: maxMarks,
        });
        await result.save();

        await Quiz.updateMany(
            { _id: { $in: questions.map(q => q.questionId) } },
            { $push: { attempts: { userId, score: totalScore, timeTaken, date: new Date() } } }
        );

        res.status(200).send({
            message: "Test attempt saved successfully",
            error: false
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: error.message,
            error: true
        });
    }
};

const getUserTestHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10, level } = req.query;

        let query = { userId: new mongoose.Types.ObjectId(userId) };
        if (level && level !== 'all') query.level = level;

        const total = await TestAttempt.countDocuments(query);

        const testAttempts = await TestAttempt.find(query)
            .sort({ completedAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('userId', 'name email')
            .lean(); 

        res.status(200).send({
            message: {
                attempts: testAttempts,
                total,
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit))
            },
            error: false
        });
    } catch (error) {
        console.error('getUserTestHistory error:', error);
        res.status(500).send({
            message: error.message || 'Error fetching test history',
            error: true
        });
    }
};

const getTestAttemptDetails = async (req, res) => {
    try {
        const { attemptId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(attemptId)) {
            return res.status(400).send({
                message: "Invalid attempt ID format",
                error: true
            });
        }

        const testAttempt = await TestAttempt.findById(new mongoose.Types.ObjectId(attemptId))
            .populate('userId', 'name email')
            .lean()
            .exec();

        if (!testAttempt) {
            return res.status(404).send({
                message: "Test attempt not found",
                error: true
            });
        }

        const formattedAttempt = {
            ...testAttempt,
            type: testAttempt.type || 'quiz',
            level: testAttempt.level || 'medium',
            totalScore: testAttempt.totalScore || 0,
            maxMarks: testAttempt.maxMarks || 0,
            timeTaken: testAttempt.timeTaken || 0,
            completedAt: testAttempt.completedAt || new Date(),
            questions: testAttempt.questions.map(q => ({
                ...q,
                questionText: q.questionText || '',
                correctAnswer: q.correctAnswer || '',
                userAnswer: q.userAnswer || '',
                isCorrect: !!q.isCorrect,
                score: q.score || 0
            }))
        };
        return res.status(200).send({
            message: formattedAttempt,
            error: false
        });
    } catch (error) {
        console.error('getTestAttemptDetails error:', error);
        res.status(500).send({
            message: error.message || 'Error fetching test attempt details',
            error: true
        });
    }
};

const getTestAnalytics = async (req, res) => {
    try {
        const { userId } = req.params;

        const analytics = await TestAttempt.aggregate([
            { 
                $match: { 
                    userId: new mongoose.Types.ObjectId(userId) 
                } 
            },
            {
                $group: {
                    _id: {
                        type: "$type", 
                        level: "$level"
                    },
                    averageScore: { $avg: "$totalScore" },
                    highestScore: { $max: "$totalScore" },
                    totalAttempts: { $sum: 1 },
                    averageTimeTaken: { $avg: "$timeTaken" }
                }
            }
        ]);

        res.status(200).send({
            message: analytics,
            error: false
        });
    } catch (error) {
        console.error('getTestAnalytics error:', error);
        res.status(500).send({
            message: error.message || 'Error fetching analytics',
            error: true
        });
    }
};


module.exports = { saveTestAttempt, getUserTestHistory, getTestAttemptDetails, getTestAnalytics };