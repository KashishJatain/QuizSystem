const Message = require("../Model/messageModel");
const User = require("../Model/userModel");

const sendMessage = async (req, res) => {
    try {
        const { to, message } = req.body;
        const from = req.user._id;
        if (!req.user.isAdmin) {
            return res.status(403).send({ message: "Only admins can send messages", error: true });
        }
        const newMessage = new Message({
            from,
            to,
            message
        });

        await newMessage.save();
        res.status(200).send({ message: "Message sent successfully", error: false });
    } catch (error) {
        res.status(500).send({ message: error.message, error: true });
    }
};

const getMessages = async (req, res) => {
    try {
        const userId = req.user._id;
        const messages = await Message.find({ to: userId })
            .populate('from', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).send({ message: messages, error: false });
    } catch (error) {
        res.status(500).send({ message: error.message, error: true });
    }
};
const deleteMessage = async (req, res) => {
    try {
        const messageId = req.params.id;
        await Message.findByIdAndDelete(messageId);
        res.status(200).send({ message: "Message deleted successfully", error: false });
    } catch (error) {
        res.status(500).send({ message: error.message, error: true });
    }
};
const markAsRead = async (req, res) => {
    try {
        const messageId = req.params.id;
        await Message.findByIdAndUpdate(messageId, { read: true });
        res.status(200).send({ message: "Message marked as read", error: false });
    } catch (error) {
        res.status(500).send({ message: error.message, error: true });
    }
};

module.exports = { sendMessage, getMessages, deleteMessage, markAsRead };