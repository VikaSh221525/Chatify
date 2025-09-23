import express from "express";
import { loginHandler, logoutHandler, registerHandler, updateProfileHandler } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection);

router.post("/register", registerHandler);

router.post("/login", loginHandler);

router.post("/logout", logoutHandler);

router.patch("/update-profile", protectRoute ,updateProfileHandler)

router.get("/check", protectRoute, (req, res) => res.status(200).json({ message: "User is authenticated" }))

export default router;
