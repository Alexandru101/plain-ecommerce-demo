// Modules //
import express from "express";
import crypto, { hash } from "crypto";

// Utils //
import { ERROR_CODES } from "../utils/ErrorCodes.js";
import { rateLimiter } from "../utils/Redis.js";
import Newsletter from "../models/Newsletter.js";
import { sendNewsletterVerification, emailTemplate } from "../utils/Email.js";

// Router //
const router = express.Router();

// Rate Limiters //
const RATE_LIMIT_TYPES = Object.freeze({
    SUBSCRIBE: "subscribe",
    EMAIL_VERIFICATION: "email-verification",
    UNSUBSCRIBE: "unsubscribe"
});

async function checkRateLimiter(req, res, type) {
    try {
        const userKey = `rate-limit:newsletter-${type}:${req.ip}`;
        await rateLimiter.consume(userKey);

        return true;
    } catch(err) {
        if (err.msBeforeNext) {
            res.status(429).json({
                success: false,
                message: "Too many requests, please try again later."
            });

            return false;
        }

        throw err;
    }
};

// Newsletter subscribe api //
router.post("/newsletter-subscribe", async (req, res) => {
    try {
        if (!(await checkRateLimiter(req, res, RATE_LIMIT_TYPES.SUBSCRIBE))) {
            return;
        }
        
        // Grabbing user input //
        const email = req.body.email?.trim().toLowerCase();
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email not found."
            });
        }
        
        // Validating email //
        let subscriber = await Newsletter.findOne({ email });
        if (subscriber && subscriber.verified) {
            return res.status(409).json({
                success: false,
                message: "Email already subscribed to the newsletter."
            });
        }

        // Subscribing email to newsletter document //
        if (subscriber) {
            subscriber.subscribed = true;
        } else {
            subscriber = await Newsletter.create({
                email,
                subscribed: true
            });
        }

        // Generating token then storing the token hashed within database //
        const token = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

        subscriber.verificationTokenHash.token = tokenHash;
        subscriber.verificationTokenHash.expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

        await subscriber.save();

        // Sending email verification //
        if (!email || !token) {
            console.log("Email or token not found, cannot send verification email.");
        } else {
            await sendNewsletterVerification(email, token);
            console.log(`Verification email sent to ${email} with token: ${token}`);
        }
        
        await sendNewsletterVerification(email, token);

        res.status(201).json({
            success: true,
            message: "Subscribed to newsletter, check your inbox."
        });
    } catch(err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: `Error: ${ERROR_CODES[String(err.code)] || err.message}`
        });
    }
});

// Newsletter email verify api //
router.post("/newsletter-verify-email", async (req, res) => {
    try {
        if (!(await checkRateLimiter(req, res, RATE_LIMIT_TYPES.EMAIL_VERIFICATION))) {
            return;
        }

        // Grabbing token //
        const token = req.body.token;
        if (!token) {
            return res.status(404).json({
                success: false,
                message: "Invalid request, verification token not found."
            });
        }

        // Hashing token //
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        // Validating user //
        const existingUser = await Newsletter.findOne({
            verified: false,
            "verificationTokenHash.token": hashedToken,
            "verificationTokenHash.expiresAt": { $gt: new Date() }
        });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "Invalid or expired verification link"
            });
        }

        existingUser.verified = true;
        existingUser.verificationTokenHash.token = undefined;
        existingUser.verificationTokenHash.expiresAt = undefined;

        // Creating unsubscribe token //
        const unsubscribeToken = crypto.randomBytes(32).toString("hex");
        const hashedUnsubscribeToken = crypto.createHash("sha256").update(unsubscribeToken).digest("hex");

        existingUser.unsubscribeTokenHash = hashedUnsubscribeToken;

        await existingUser.save();

        // Notifying user //
        await emailTemplate(
            existingUser.email,                                     // Email
            unsubscribeToken,                                       // Unsubscribe token
            "You subscribed to the cloth newsletter",               // Title
            "Get 10% off your first order by creating an account"   // Description
        );

        res.status(200).json({
            success: true,
            message: "Successfully verified email"
        });
    } catch(err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: `Error: ${ERROR_CODES[String(err.code)] || err.message}`
        });
    }
});

// Newsletter unsubscribe API //
router.post("/newsletter-unsubscribe", async (req, res) => {
    try {
        if (!(await checkRateLimiter(req, res, RATE_LIMIT_TYPES.UNSUBSCRIBE))) {
            return;
        }

        // Grabbing token //
        const token = req.query.token;
        if (!token) {
            return res.status(200).send();
        }

        // Hashing token //
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        // Quering database to find user //
        const existingUser = await Newsletter.findOne({ unsubscribeTokenHash: hashedToken });
        if (!existingUser) {
            return res.status(200).send();
        }

        // Unsubscribing user //
        await Newsletter.deleteOne({ _id: existingUser._id });

        res.status(200).send();
    } catch(err) {
        console.error(err);

        res.status(500).send();
    }
})

export default router;