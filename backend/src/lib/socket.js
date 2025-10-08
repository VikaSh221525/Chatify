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

// this is for storing online users
const userSocketMap = {}; //{userId : socketId}

// handle connection
io.on("connection", (socket) => {
    console.log("a user connected", socket.user.fullName);

    const userId = socket.userId;
    userSocketMap[userId] = socket.id;

    // io.emit() is send events to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on("disconnect", () => {
        console.log("a user disconnected", socket.user.fullName);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

export {io, app, server}
