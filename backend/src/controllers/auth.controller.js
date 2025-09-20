import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";

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
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ fullName, email, password: hashedPassword });
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

export function loginHandler(req, res) {
    res.json({ message: "Login" });
}
