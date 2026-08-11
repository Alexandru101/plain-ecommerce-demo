// Modules //
import express from "express";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Utils //
import { ERROR_CODES } from "../utils/ErrorCodes.js";
import { rateLimiter } from "../utils/Redis.js";
import { authMiddleware, generateAccessToken, generateRefreshToken } from "../utils/Jwt.js";
import user from "../models/User.js";

// Router //
const router = express.Router();

// Rate Limiters //
const RATE_LIMIT_TYPES = Object.freeze({
    AUTHENTICATION: "authentication",
    REFRESH: "refresh"
});

async function checkRateLimiter(req, res, RATE_LIMIT_TYPE) {
    try {
        const userKey = `rate-limit:${RATE_LIMIT_TYPE}:${req.ip}`;
        await rateLimiter.consume(userKey);

        return true;
    } catch(err) {
        if (err.msBeforeNext) {
            res.status(429).json({
                success: false,
                message: "Too many requests, please try again later."
            });

            return false;
        };

        throw err;
    }
}

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
        if (!(await checkRateLimiter(req, res, RATE_LIMIT_TYPES.AUTHENTICATION))) {
            return;
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
            sameSite: "none",
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        // Setting refresh token to the users cookie //
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
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

router.post("/logout", authMiddleware, (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none"
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none"
    });

    res.sendStatus(200);
});

router.post("/refresh", async (req, res) => {
    try {
        // Checking if user is rate limited //
        if (!(await checkRateLimiter(req, res, RATE_LIMIT_TYPES.REFRESH))) {
            return;
        }

        // Grabbing refresh token and verifying it //
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.sendStatus(401); // Token not found
        }

        let payload;

        try {
            payload = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_TOKEN_SECRET
            );
        } catch(err) {
            return res.sendStatus(401); // Token invalid or expired
        }

        // Quering database to find user //
        const existingUser = await user.findById(payload.userId);
        if (!existingUser) {
            return res.sendStatus(401);
        }

        // Generating new access token //
        const newAccessToken = generateAccessToken(existingUser);

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        return res.sendStatus(200);
    } catch(err) {
        console.error(err);

        return res.sendStatus(500);
    }
});

export default router;