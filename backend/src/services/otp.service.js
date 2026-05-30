import crypto from "crypto";
import twilio from "twilio";
import { env } from "../config/env.js";
import { OtpSession } from "../models/OtpSession.js";

function generateCode() {
  return crypto.randomInt(100000, 999999).toString();
}

function getTwilioClient() {
  if (!env.twilioAccountSid || !env.twilioAuthToken) return null;
  return twilio(env.twilioAccountSid, env.twilioAuthToken);
}

export async function sendOtp(phone, purpose = "register", role = "citizen") {
  const normalized = phone.replace(/\s/g, "");
  const code = generateCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await OtpSession.deleteMany({ phone: normalized });
  await OtpSession.create({ phone: normalized, code, purpose, role, expiresAt });

  if (env.otpDevMode || !getTwilioClient()) {
    console.log(`[OTP DEV] ${normalized} → ${code} (${purpose})`);
    return { sent: true, dev: true };
  }

  const client = getTwilioClient();
  await client.messages.create({
    body: `Your RapidAid verification code is ${code}. Valid for 10 minutes.`,
    from: env.twilioPhoneNumber,
    to: normalized.startsWith("+") ? normalized : `+91${normalized.replace(/^0/, "")}`,
  });

  return { sent: true, dev: false };
}

export async function verifyOtp(phone, code) {
  const normalized = phone.replace(/\s/g, "");
  const session = await OtpSession.findOne({ phone: normalized }).sort({ createdAt: -1 });

  if (!session) {
    return { valid: false, error: "No OTP session found. Request a new code." };
  }

  if (session.expiresAt < new Date()) {
    await OtpSession.deleteOne({ _id: session._id });
    return { valid: false, error: "OTP expired." };
  }

  if (session.attempts >= 5) {
    return { valid: false, error: "Too many attempts." };
  }

  if (session.code !== code) {
    session.attempts += 1;
    await session.save();
    return { valid: false, error: "Invalid OTP." };
  }

  await OtpSession.deleteOne({ _id: session._id });
  return { valid: true, role: session.role, purpose: session.purpose };
}
