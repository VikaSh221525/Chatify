import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, res);
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ message: "Too many requests! Rate limit exceeded. Please try again later." });
            } else if (decision.reason.isBot()) {
                return res.status(403).json({ message: "Bot access denied" });
            } else {
                return res.status(403).json({
                    message: "Access denied by security policy"
                });
            }
        }

        // check for spoofed bot
        if(decision.results.some(isSpoofedBot)){
            return res.status(403).json({
                error: "Spoofed bot access denied", 
                message: "Spoofed bot access denied" 
            });
        }

        next();
    } catch (error) {
        console.log("Arcjet inspecting error", error);
        next();
    }
}