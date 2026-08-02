// Modules //
import express from "express";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

// Utils //
import { ERROR_CODES } from "../utils/ErrorCodes.js";
import { rateLimiter } from "../utils/Redis.js";
import User from "../models/User.js";

// Router //
const router = express.Router();

// Configs //
const HASH_SALT = 10;

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

// Registration API //
router.post("/registration", async (req, res) => {
    try {
        // Checking if user is rate-limited //
        try {
            const userIP = req.ip;
            const userKey = `rate-limit:registration:${userIP}`;
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
        const {password, captchaID, ...userData } = req.body;
        if (!password || !captchaID) {
            let message = "";

            if (!password) message += "Password not found. ";
            if (!captchaID) message += "Captcha not completed.";

            return res.status(400).json({
                success: false,
                message: message.trim()
            });
        }

        // Validating Captcha //
        const captchaResponse = await verifyCaptcha(captchaID);
        if (!captchaResponse.success) {
            console.log(captchaResponse.error);

            return res.status(400).json({
                success: false,
                message: `${ERROR_CODES[captchaResponse.error.detail]}`
            });
        }

        // Encrypting Password //
        const user = new User({
            ...userData,
            password: password
        });

        user.password = await bcrypt.hash(password, HASH_SALT);
        await user.save();

        res.status(201).json({
            success: true,
            message: "Successfully Registered Account"
        });
    } catch(err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: `Error: ${ERROR_CODES[String(err.code)] || err.message}`
        })
    }
})

export default router;