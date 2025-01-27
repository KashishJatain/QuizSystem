const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendVerificationEmail = async (email, verificationToken) => {
    try {
        console.log('Attempting to send email to:', email);
        console.log('Using EMAIL_USER:', process.env.EMAIL_USER);
        
        const verificationLink = `http://localhost:5173/verify/${verificationToken}`;
        
        const mailOptions = {
            from: {
                name: 'QuizSystem',
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: 'Verify Your Email Address',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Email Verification</title>
                </head>
                <body style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #333;">Email Verification</h2>
                    <p>Thank you for registering! Please verify your email address by clicking the button below:</p>
                    <div style="margin: 20px 0;">
                        <a href="${verificationLink}" 
                           style="background-color: #4CAF50; 
                                  color: white; 
                                  padding: 10px 20px; 
                                  text-decoration: none; 
                                  border-radius: 5px;
                                  display: inline-block;">
                            Verify Email Address
                        </a>
                    </div>
                    <p>Or copy and paste this link in your browser:</p>
                    <p style="color: #666;">${verificationLink}</p>
                    <p style="color: #999; font-size: 12px;">If you didn't create an account, you can safely ignore this email.</p>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
       
        return info;
    } catch (error) {
        console.error('Detailed email error:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            code: error.code,
            command: error.command
        });
        throw error;
    }
};

const testEmailConnection = async () => {
    try {
        await transporter.verify();
        console.log('Email server connection successful');
        return true;
    } catch (error) {
        console.error('Email server connection failed:', error);
        return false;
    }
};

module.exports = { sendVerificationEmail, testEmailConnection };