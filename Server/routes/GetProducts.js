// Modules //
import express from "express";

// Utils //
import { ERROR_CODES } from "../utils/ErrorCodes.js";
import { client, globalRateLimiter } from "../utils/Redis.js";
import products from "../models/Products.js";

// Router //
const router = express.Router();

// Configs //
const PRODUCTS_CACHE_EXPIRY = 300 // 300 seconds = 5 minutes

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

export default router;