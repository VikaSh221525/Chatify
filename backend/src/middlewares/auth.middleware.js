import jwt from "jsonwebtoken";
import userModel from "../models/User.model.js";

export async function protectRoute(req, res, next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if(!decodedToken){
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await userModel.findById(decodedToken.userId).select("-password");
        if(!user){
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("Error verifying token", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
