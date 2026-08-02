import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },

    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"]
    },

    firstName: {
        type: String,
        minlength: 1,
        maxlength: 20,
        required: true,
        trim: true,
        match: /^[A-Za-z]+$/
    },

    lastName: {
        type: String,
        minlength: 1,
        maxlength: 20,
        required: true,
        trim: true,
        match: /^[A-Za-z]+$/
    },

    password: {
        type: String,
        required: true
    },

    resetPasswordToken: {
        token: {
            type: String,
            default: undefined
        },

        expiresAt: {
            type: Date,
            default: undefined
        }
    }
}, {
    timestamps: true
});

export default mongoose.model("User", userSchema);