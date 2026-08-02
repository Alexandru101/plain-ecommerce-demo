import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;

export const generateAccessToken = (user) => {
    return jwt.sign(
        { userId: user._id },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    )
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        { userId: user._id },
        REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" } 
    )
};