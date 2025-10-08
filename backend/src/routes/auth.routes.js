import express from "express";
import { loginHandler, logoutHandler, registerHandler, updateProfileHandler } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";
import userModel from "../models/User.model.js";

const router = express.Router();

router.use(arcjetProtection);

router.post("/register", registerHandler);

router.post("/login", loginHandler);

router.post("/logout", logoutHandler);

router.patch("/update-profile", protectRoute ,updateProfileHandler)

router.get("/check", protectRoute, async (req, res) => {
        try {
            const user = await userModel.findById(req.user._id).select("-password");
            res.status(200).json(user);
        } catch (error) {
            console.log("Error in auth check: ", error);
            res.status(500).json({ message: "Internal server error" });
        }
    })

export default router;
