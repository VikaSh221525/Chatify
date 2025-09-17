import "dotenv/config"
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.route.js";

const app = express();
app.use(express.json());


const port = process.env.PORT;
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
