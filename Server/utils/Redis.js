import { createClient } from "redis";
import { RateLimiterRedis } from "rate-limiter-flexible";
import dotenv from "dotenv";
dotenv.config();

const client = createClient({ url: process.env.REDIS_URL });
client.on("error", (err) => {
  console.error(`Redis client error: ${err}`);
});

const rateLimiter = new RateLimiterRedis({
  storeClient: client,
  useRedisPackage: true,
  points: 12, // Number of requests allowed
  duration: 60 // Time window in seconds
});

const globalRateLimiter = new RateLimiterRedis({
  storeClient: client,
  useRedisPackage: true,
  points: 200, // Number of requests allowed
  duration: 60 // Time window in seconds
});

await client.connect();
export { client, rateLimiter, globalRateLimiter };