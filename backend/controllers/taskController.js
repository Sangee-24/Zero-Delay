import taskModel from "../models/taskModel.js";
import userModel from "../models/userModel.js";
import { createTransport } from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

const sendMail = (email, subject, title, description) => {
    console.log('📧 Attempting to send email to:', email);
    console.log('🔑 Using Gmail credentials:', process.env.GMAIL_USER);
    
    var transporter = createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    var mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: subject,
        html: `<h1>Task added successfully</h1><h2>Title: ${title}</h2><h3>Description: ${description}</h3>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('❌ Email sending failed:', error);
            console.log('Error code:', error.code);
            console.log('Error command:', error.command);
        } else {
            console.log('✅ Email sent successfully: ' + info.response);
        }
    });
}

const addTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.user.id;
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newTask = new taskModel({ title, description, completed: false, userId });
        const savedTask = await newTask.save();
        
        // Send email notification
        sendMail(user.email, "Task Added", title, description);
        
        return res.status(200).json({ message: "Task added successfully", task: savedTask });
    } catch (error) {
        console.log('Task creation error:', error);
        return res.status(500).json({ message: error.message });
    }
}

const removeTask = (req, res) => {
    const { id } = req.params;
    console.log("Attempting to delete task with id: ", id);
    taskModel.findByIdAndDelete(id)
        .then(() => res.status(200).json({ message: "Task deleted successfully" }))
        .catch((error) => {
            console.error("Error deleting task:", error);
            res.status(500).json({ message: "Error deleting task", error: error.message });
        });
}

const getTask = (req, res) => {
    taskModel.find({ userId: req.user.id })
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(501).json({ message: error.message }))
}

const updateTaskStatus = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await taskModel.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        // Toggle the completed status
        task.completed = !task.completed;
        await task.save();
        res.status(200).json({ message: "Task status updated successfully", task });
    } catch (error) {
        console.error("Error updating task status:", error);
        res.status(500).json({ message: "Error updating task status", error: error.message });
    }
}

export { addTask, getTask, removeTask, updateTaskStatus }
