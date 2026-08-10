// Modules //
import express from "express";

// Utils //
import { ERROR_CODES } from "../utils/ErrorCodes.js";
import { client, globalRateLimiter } from "../utils/Redis.js";
import { authMiddleware } from "../utils/Jwt.js";

// MongoDB Schemas //
import products from "../models/Products.js";
import User from "../models/User.js";

// Router //
const router = express.Router();

// Configs //
const PRODUCTS_CACHE_EXPIRY = 300 // 300 seconds = 5 minutes
const USERDATA_CACHE_EXPIRY = 300 // 300 seconds = 5 minutes

router.get("/get-products", async (req, res) => {
    try {
        // Rate Limiter //
        try {
            const userKey = `rate-limit:global:${req.ip}`;
            await globalRateLimiter.consume(userKey);
        } catch(err) {
            if (err.msBeforeNext) {
                return res.status(429).json({
                    success: false,
                    message: "Too many requests, please try again later."
                });
            }

            throw err;
        }

        // Redis caching //
        const cacheKey = "products:all";

        try {
            const cachedProducts = await client.get(cacheKey);
            if (cachedProducts) {
                return res.status(200).json({
                    success: true,
                    products: JSON.parse(cachedProducts)
                });
            }
        } catch(err) {
            console.log(`Redis Error: ${err}`);
        }

        // If redis cache is missed we are quering the database for all the products //
        const allProducts = await products.find({}).lean();

        // Storing products within redis for next api request //
        try {
            await client.set(
                cacheKey,
                JSON.stringify(allProducts),
                { EX: PRODUCTS_CACHE_EXPIRY }
            );
        } catch(err) {
            console.log(`Redis Error: ${err}`);
        }

        res.status(200).json({
            success: true,
            products: allProducts
        });
    } catch(err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: `Error: ${ERROR_CODES[String(err.code)] || err.message}`
        });
    }
});

router.get("/get-userdata", authMiddleware, async (req, res) => {
    try {
        // Rate Limiter //
        try {
            const userKey = `rate-limit:global:${req.ip}`;
            await globalRateLimiter.consume(userKey);
        } catch(err) {
            if (err.msBeforeNext) {
                return res.status(429).json({
                    success: false,
                    message: "Too many requests, please try again later"
                });
            }

            throw err;
        }

        // Redis caching //
        const cacheKey = `userdata:${req.user.userId}`;

        try {
            const cachedData = await client.get(cacheKey);
            if (cachedData) {
                return res.status(200).json({
                    success: true,
                    userData: JSON.parse(cachedData)
                });
            }
        } catch(err) {
            console.log(`Redis Error: ${err}`);
        }

        // If redis cache misses, we will query mongoDB and set the userdata to redis for next request //
        const userData = await User.findById(req.user.userId)
        .select({
            email: 1,
            gender: 1,
            firstName: 1,
            lastName: 1,
            createdAt: 1
        }).lean();

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "Failed to grab userdata!"
            });
        }

        try {
            await client.set(
                cacheKey,
                JSON.stringify(userData),
                { EX: USERDATA_CACHE_EXPIRY }
            );
        } catch(err) {
            console.error(`Redis Error: ${err}`);
        }

        return res.status(200).json({
            success: true,
            userData: userData
        });
    } catch(err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: `Error: ${ERROR_CODES[String(err.code)] || err.message}`
        });
    }
});

export default router;