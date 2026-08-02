// Utils //
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

// Routes //
import registration from "./routes/Registration.js";
import authentication from "./routes/Authentication.js";
import forgotPassword from "./routes/ForgotPassword.js";
import resetPassword from "./routes/ResetPassword.js";
import getProducts from "./routes/GetProducts.js";
import newsletter from "./routes/Newsletter.js";
import test from "./routes/test.js";

const app = express();
const PORT = process.env.PORT;

// Midleware //
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes Initialization //
app.use("/api", registration);
app.use("/api", authentication);
app.use("/api", forgotPassword);
app.use("/api", resetPassword);
app.use("/api", getProducts);
app.use("/api", newsletter);
app.use("/api", test); // Remove this in production, this is only for testing //

// Server Initialization //
app.listen(PORT, "0.0.0.0", () => {
    console.log(`App listening on port [http://localhost:${PORT}]`);
});

// Connecting MongoDB //
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("MongoDB connected succesffully");
}).catch((err) => {
    console.log(`MongoDB connection failed: ${err.message}`); 
});