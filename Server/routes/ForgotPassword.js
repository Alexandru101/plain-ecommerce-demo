// Modules //
import express from "express";
import fetch from "node-fetch";
import crypto from "crypto";

// Utils //
import { rateLimiter } from "../utils/Redis.js";
import { ERROR_CODES } from "../utils/ErrorCodes.js";
import { sendResetPasswordLink } from "../utils/Email.js";
import user from "../models/User.js";

// Router //
const router = express.Router();

// Captcha Validation //
const verifyCaptcha = async (captchaID) => {
    const response = await fetch("https://global.frcapi.com/api/v2/captcha/siteverify", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-Key": process.env.FRIENDLY_CAPTCHA_SECRET
        },
        body: JSON.stringify({
            response: captchaID,
            siteKey: process.env.FRIENDLY_CAPTCHA_SITE_KEY
        })
    });

    return response.json();
}

router.post("/forgot-password", async (req, res) => {
    try {
        try {
            const userKey = `rate-limit:forgot-password:${req.ip}`;
            await rateLimiter.consume(userKey);
        } catch(err) {
            if (err.msBeforeNext) {
                return res.status(429).json({
                    success: false,
                    message: "Too many requests, please try again later."
                });
            }

            throw err;
        }

        // Grabbing user input //
        const { email, captchaID } = req.body;
        if (!email || !captchaID) {
            let message = "";

            if (!email) message = "Email not found. ";
            if (!captchaID) message += "Captcha not completed.";

            return res.status(400).json({
                success: false,
                message: message.trim()
            });
        }

        // Verifying captcha //
        const captchaResponse = await verifyCaptcha(captchaID);
        if (!captchaResponse.success) {
            console.log(captchaResponse.error);

            return res.status(400).json({
                success: false,
                message: `${ERROR_CODES[captchaResponse.error.detail]}`
            });
        }

        // Database query to find the user by email //
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            
            // For enahncing security we are returning the same response each time even if the email is invalid //
            return res.status(200).json({
                success: true,
                message: "If an account exists with that email, a password reset link has been sent."
            })
        }

        // Generating unique password reset token //
        const token = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        existingUser.resetPasswordToken.token = hashedToken;
        existingUser.resetPasswordToken.expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes 
        
        await existingUser.save();
        
        // Sending email //
        await sendResetPasswordLink( existingUser.email, token );

        res.status(200).json({
            success: true,
            message: "If an account exists with that email, a password reset link has been sent."
        });
    } catch(err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: `Error: ${ERROR_CODES[String(err.code)] || err.message}`
        })
    }
});

export default router;