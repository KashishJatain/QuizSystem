const express = require('express');
const { saveTestAttempt, getUserTestHistory, getTestAttemptDetails, getTestAnalytics } = require('../Controller/testAttemptController');
const { authmiddleware } = require("../Middleware/authmiddleware");
const app=express.Router();
app.post('/', saveTestAttempt);
app.get('/history/:userId', getUserTestHistory);
app.get('/:attemptId', getTestAttemptDetails);
app.get('/test-analytics/:userId', getTestAnalytics);

module.exports = app;
