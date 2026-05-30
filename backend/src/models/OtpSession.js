import mongoose from "mongoose";

const otpSessionSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, index: true },
    code: { type: String, required: true },
    purpose: { type: String, enum: ["register", "login"], default: "register" },
    role: { type: String, enum: ["citizen", "ambulance"] },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const OtpSession = mongoose.model("OtpSession", otpSessionSchema);
