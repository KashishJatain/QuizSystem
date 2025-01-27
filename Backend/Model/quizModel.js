
const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
    section: { 
        type: String, 
        required: true, 
        enum: ['Physics', 'Chemistry', 'Maths'] 
    },
    type: { 
        type: String, 
        required: true, 
        enum: ['mcq', 'numerical'] 
    },
    level: { 
        type: String, 
        required: true 
    },
    question: { 
        type: String, 
        required: true 
    },
    image:{
        type: String,
        required: false
    },
    option: { 
        type: [String], 
        required: function() { return this.type === 'mcq'; }
    },
    answer: { 
        type: String, 
        required: true 
    },
   
    tolerance: { 
        type: Number, 
        default: 0.1, 
        required: function() { return this.type === 'numerical'; } 
    }
}, { timestamps: true });

const Quiz = mongoose.model("quiz", quizSchema);
module.exports = Quiz;
