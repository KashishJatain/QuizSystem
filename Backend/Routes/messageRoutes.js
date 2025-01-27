const express = require("express");
const { sendMessage, getMessages, deleteMessage, markAsRead } = require("../Controller/messageController");
const { authmiddleware } = require("../Middleware/authmiddleware");

const router = express.Router();

router.use(authmiddleware);
router.post("/send", sendMessage);
router.get("/", getMessages);
router.delete("/:id", deleteMessage);
router.patch("/:id/read", markAsRead);

module.exports = router;