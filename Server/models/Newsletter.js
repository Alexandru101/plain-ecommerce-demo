import mongoose from "mongoose";
import { type } from "node:os";

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },

  subscribed: {
    type: Boolean,
    default: true
  },

  verified: {
    type: Boolean,
    default: false
  },

  verificationTokenHash: {
    token: {
      type: String,
      default: null
    },

    expiresAt: {
      type: Date,
      default: null
    }
  },

  unsubscribeTokenHash: {
    type: String,
    default: null
  },

  subscribedAt: {
    type: Date,
    default: Date.now
  },

  verifiedAt: Date
})

export default mongoose.model("newsletter", newsletterSchema);