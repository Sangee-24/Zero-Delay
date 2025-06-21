import userModel from "../models/userModel.js";
import { createTransport } from "nodemailer"
import crypto from "crypto"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
dotenv.config()

// Route to handle "forgot password" request
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    // Check if email exists in the database
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetToken = resetToken;
    await user.save();
    
    //Send email with reset token
    const resetUrl = `http://localhost:3000/resetPassword?token=${resetToken}`;
    var transporter = createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    var mailOptions = {
        from: `⏳ ZeroDelay <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Your ZeroDelay Password Reset Link",
        html:`
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <h1 style="color: #333;">Reset Your Password</h1>
                <p>Hello,</p>
                <p>We received a request to reset the password for your ZeroDelay account. You can reset your password by clicking the link below:</p>
                <p style="text-align: center; margin: 20px 0;">
                    <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                </p>
                <p>If you did not request a password reset, please ignore this email.</p>
                <p>Thanks,<br/>The ZeroDelay Team</p>
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin-top: 20px;" />
                <p style="font-size: 12px; color: #888;">If you're having trouble clicking the button, copy and paste this URL into your browser: <a href="${resetUrl}">${resetUrl}</a></p>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Password reset email sent successfully: ' + info.response);
        res.status(200).json({ message: 'A link to reset your password has been sent to your email.' });
    } catch (error) {
        console.log('❌ Password reset email sending failed:', error);
        res.status(500).json({ message: 'Failed to send password reset email.' });
    }
};
  
//  Route to handle password reset request
const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    
    // Verify reset token
    console.log("token: ", token);
    const user = await userModel.findOne({ resetToken:token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }
    
    // Update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetToken = null;
    await user.save();
    
    res.status(200).json({ message: 'Password reset successful' });
  };
 export {forgotPassword, resetPassword}
  
