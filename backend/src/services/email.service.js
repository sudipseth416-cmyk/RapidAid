import crypto from "crypto";
import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter;

function getTransporter() {
  if (transporter) return transporter;
  if (env.smtpHost && env.smtpUser) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      auth: { user: env.smtpUser, pass: env.smtpPass },
    });
  } else {
    transporter = {
      sendMail: async (opts) => {
        console.log("[EMAIL DEV]", opts.to, opts.subject, opts.text?.slice(0, 200));
        return { messageId: "dev" };
      },
    };
  }
  return transporter;
}

export function generateEmailToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function sendHospitalVerificationEmail(user) {
  const verifyUrl = `${env.appUrl}/api/auth/verify-email?token=${user.emailVerificationToken}`;
  const transport = getTransporter();
  await transport.sendMail({
    from: env.emailFrom,
    to: user.profile.email,
    subject: "Verify your RapidAid Hospital account",
    text: `Hello ${user.profile.adminName || user.profile.name},\n\nVerify your email: ${verifyUrl}\n\nAfter verification, your account will await manual approval from RapidAid operations.`,
    html: `<p>Hello ${user.profile.adminName || user.profile.name},</p><p><a href="${verifyUrl}">Verify your email</a></p><p>Your hospital account requires manual approval after email verification.</p>`,
  });
}

export async function sendHospitalApprovedEmail(user) {
  const transport = getTransporter();
  await transport.sendMail({
    from: env.emailFrom,
    to: user.profile.email,
    subject: "RapidAid Hospital account approved",
    text: `Your hospital account for ${user.profile.hospitalName} has been approved. You may now access the coordination dashboard.`,
  });
}
