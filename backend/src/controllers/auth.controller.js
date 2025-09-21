import userModel from "../models/User.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import cloudinary from "../lib/cloudinary.js";

export async function registerHandler(req, res) {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        // check if email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email address format" });
        }
        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({ fullName, email, password: hashedPassword });
        if (newUser) {
            const saveUser = await newUser.save();
            generateToken(saveUser._id, res);
            res.status(201).json({ message: "User created successfully", user: saveUser });

            // send welcome email
            try {
                await sendWelcomeEmail(saveUser.email, saveUser.fullName, process.env.CLIENT_URL);
            } catch (error) {
                console.log("Error sending welcome email", error);
            }
        }

        else {
            res.status(400).json({ message: "User creation failed" });
        }

    } catch (error) {
        console.log("Error creating user", error);
        res.status(500).json({ message: "Internal server error" });
    }

}

export async function loginHandler(req, res) {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const user  = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        generateToken(user._id, res);
        res.status(200).json({ message: "User logged in successfully", user });
    } catch (error) {
        console.log("Error logging in user", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export function logoutHandler(req, res) {
    res.cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: "User logged out successfully" });
}

export async function updateProfileHandler(req, res){
    try {
        const {profilePic} = req.body;
        if(!profilePic) return res.status(400).json({ message: "Profile picture is required" });

        // from middleware
        const userId = req.user._id;
        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            folder: "profile_pics",
            public_id: userId
        });
        const updatedUser = await userModel.findByIdAndUpdate(userId, {
            profilePic: uploadResponse.secure_url
        }, {new: true}).select("-password");
        if(updatedUser){
            res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
        }

    } catch (error) {
        console.log("Error updating profile", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
