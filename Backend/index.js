require("dotenv").config();
const express = require("express");
const app = express();
const cors=require("cors");
const cookieParser=require("cookie-parser");
const dbConnect=require("./db");

const authRouter=require("./Routes/userRoutes");
const quizRouter=require("./Routes/quizRoutes");
const noticeRouter=require("./Routes/noticeRoutes");
const resultRouter=require("./Routes/resultRoutes");
const messageRouter = require("./Routes/messageRoutes");
const testAttemptRoutes = require('./Routes/testAttemptRoutes');
const { testEmailConnection } = require('./utils/emailService');

testEmailConnection()
    .then(success => {
        if (success) {
            console.log('Email service is ready');
        } else {
            console.log('Email service configuration needs to be checked');
        }
    });

const corsConfig = {
  origin: "http://localhost:5173",
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
  credentials: true,
  exposedHeaders: ['*', 'Authorization' ]
}

const fs = require('fs');
const path = require('path');

const uploadsPath = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath);
}


app.use(cors(corsConfig))
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/", (req, res) => res.send("Welcome To Quiz App Server"));
app.use("/auth",authRouter);
app.use("/quiz",quizRouter);

app.use('/uploads', express.static('uploads'));

app.use("/notices",noticeRouter);
app.use("/messages", messageRouter);
app.use('/test-attempt', testAttemptRoutes);
dbConnect().then(()=>{
  app.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`);
  });
})