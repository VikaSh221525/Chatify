import {Server} from "socket.io";
import http from "http";
import express from "express";
import { socketAuthMiddleware } from "../middlewares/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    } 
});

// apply auth middleware to all socket connections
io.use(socketAuthMiddleware);

// we will use this function to check if user is online or not?
export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

// this is for storing online users
const userSocketMap = {}; //{userId : socketId}

// handle connection
io.on("connection", (socket) => {
    try {
        if (!socket.user || !socket.userId) {
            console.error("No user data in socket");
            return socket.disconnect(true);
        }

        console.log(`User connected: ${socket.user.fullName} (${socket.userId})`);
        
        const userId = socket.userId;
        userSocketMap[userId] = socket.id;

        // Notify all clients about online users
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        // Handle disconnection
        socket.on("disconnect", (reason) => {
            console.log(`User disconnected: ${socket.user?.fullName || 'Unknown'} (${userId}) - ${reason}`);
            if (userSocketMap[userId] === socket.id) {
                delete userSocketMap[userId];
                io.emit("getOnlineUsers", Object.keys(userSocketMap));
            }
        });

        // Handle errors
        socket.on("error", (error) => {
            console.error(`Socket error for user ${socket.user?.fullName || 'Unknown'}:`, error);
        });

    } catch (error) {
        console.error("Error in socket connection:", error);
        socket.disconnect(true);
    }
});

export {io, app, server}
