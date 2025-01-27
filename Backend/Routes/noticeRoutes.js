const express = require('express');
const { postNotice, getNotices, deleteNotice}= require("../Controller/noticeController");
const { authmiddleware } = require("../Middleware/authmiddleware");
const app=express.Router();
app.use(authmiddleware);
app.post("/",postNotice);
app.get("/",getNotices);
app.delete("/:id",deleteNotice);


module.exports=app;

