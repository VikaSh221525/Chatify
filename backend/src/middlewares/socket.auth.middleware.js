import jwt, { decode } from "jsonwebtoken";
import userModel from "../models/User.model.js";

export const socketAuthMiddleware = async(socket, next) => {
    try {
        // extract token from cookie
        const token = socket.handshake.headers.cookie
        .split(';')
        .find(row => row.startsWith('token='))
        .split('=')[1];

        if(!token){
            console.log("socket connection rejected: No token provided");
            return next(new Error("Authentication error"));
        }

        // verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            console.log("socket connection rejected: Invalid token");
            return next(new Error("Authentication error"));
        }

        // find user
        const user = await userModel.findById(decoded.userId);
        if(!user){
            console.log("socket connection rejected: User not found");
            return next(new Error("Authentication error"));
        }

        // attach user to socket
        socket.user = user;
        socket.userId = user._id.toString();
        console.log(`Socket authentication for user : ${user.fullName} (${user._id})`);
        
        next();
    } catch (error) {
        console.log("socket connection rejected: ", error);
        return next(new Error("Authentication error"));
    }
}
