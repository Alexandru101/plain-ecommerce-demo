// Modules //
import express from "express";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

// Utils //
import { ERROR_CODES } from "../utils/ErrorCodes.js";
import { rateLimiter } from "../utils/Redis.js";
import { generateAccessToken, generateRefreshToken } from "../utils/Jwt.js";
import user from "../models/User.js";

// Router //
const router = express.Router();

// Captcha Verification //
const verifyCaptcha = async (captchaID) => {
    const response = await fetch("https://global.frcapi.com/api/v2/captcha/siteverify", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-Key": process.env.FRIENDLY_CAPTCHA_SECRET
        },
        body: JSON.stringify({
            response: captchaID,
            sitekey: process.env.FRIENDLY_CAPTCHA_SITE_KEY
        })
    });

    return response.json();
};

router.post("/authentication", async (req, res) => {
    try {
        // Checking if the user is rate limited //
        try {
            const userIP = req.ip;
            const userKey = `rate-limit:authentication:${userIP}`;
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

        // Grabbing user request //
        const { email, password, captchaID } = req.body;
        if (!email || !password || !captchaID) {
            let message = "";

            if (!email) message += "Email not found. ";
            if (!password) message += "Password not found. ";
            if (!captchaID) message += "Captcha not completed.";

            return res.status(400).json({
                success: false,
                message: message.trim()
            });
        }

        // Validating captcha //
        const captchaResponse = await verifyCaptcha(captchaID);
        if (!captchaResponse.success) {
            console.log(captchaResponse.error);

            return res.status(400).json({
                success: false,
                message: `${ERROR_CODES[String(captchaResponse.error.detail)]}`
            });
        }

        // Database query to find the user by email //
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "Invalid Email"
            });
        }

        // Validating users password //
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            })
        }

        // Generating JWT tokens //
        const accessToken = generateAccessToken(existingUser);
        const refreshToken = generateRefreshToken(existingUser);

        // Setting access token to the users cookie //
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        // Setting refresh token to the users cookie //
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({
            success: true,
            message: "Logged in successfully"
        })
    } catch(err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: `Error: ${ERROR_CODES[String(err.code)] || err.message}`
        });
    }
});

export default router;