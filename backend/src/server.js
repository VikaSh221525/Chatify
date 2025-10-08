import "dotenv/config"
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.route.js";
import path from "path";
import { connectToDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(express.json({limit: "10mb"}));  // for req.body to get data
app.use(cookieParser())
connectToDB();

const __dirname = path.resolve()


const port = process.env.PORT;
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// make ready for deployment
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")))
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
    })
}


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
