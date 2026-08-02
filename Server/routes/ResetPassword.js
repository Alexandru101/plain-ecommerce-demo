// Modules //
import express, { response } from "express";
import fetch from "node-fetch";
import crypto from "crypto";
import bcrypt from "bcrypt";

// Utils //
import { rateLimiter } from "../utils/Redis.js";
import { ERROR_CODES } from "../utils/ErrorCodes.js";
import user from "../models/User.js";

// Router //
const router = express.Router();

// Configs //
const HASH_SALT = 10;

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

router.post("/reset-password", async (req, res) => {
    try {
        try {
            const userKey = `rate-limit:reset-password:${req.ip}`;
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
        const { password, captchaID, token } = req.body;
        if (!password || !captchaID || !token) {
            let message = "";

            if (!password) message += "Please enter a new password. ";
            if (!captchaID) message += "Captcha not completed. ";
            if (!token) message += "Password reset link has expired !";

            return res.status(400).json({
                success: false,
                message: message.trim()
            });
        }

        // Veriying captcha //
        const captchaResponse = await verifyCaptcha(captchaID);
        if (!captchaResponse.success) {
            console.log(captchaResponse.error);

            return res.status(400).json({
                success: false,
                message: `${ERROR_CODES[captchaResponse.error.detail]}`
            });
        }

        // Hashing token then verifying it with a query to mongoDB //
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const existingUser = await user.findOne({
            "resetPasswordToken.token": hashedToken,
            "resetPasswordToken.expiresAt": { $gt: new Date() }
        });

        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired password reset link."
            });
        }

        // Updating credentials //
        const hashedPassword = await bcrypt.hash(password, HASH_SALT);
        existingUser.password = hashedPassword;
        existingUser.resetPasswordToken.token = null;
        existingUser.resetPasswordToken.expiresAt = null;

        await existingUser.save();

        res.status(200).json({
            success: true,
            message: "Successfully updated password"
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