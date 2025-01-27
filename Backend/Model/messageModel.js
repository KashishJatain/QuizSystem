const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Message = mongoose.model("message", messageSchema);
module.exports = Message;