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

export const authMiddleware = (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.sendStatus(401);
        }

        const payload = jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_TOKEN_SECRET
        );

        req.user = payload;

        next();
    } catch(err) {
        console.error(err);

        return res.sendStatus(401);
    }
};