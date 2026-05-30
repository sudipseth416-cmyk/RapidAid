import dotenv from "dotenv";

dotenv.config();

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function parseCorsOrigins() {
  const origins = new Set();

  const clientUrl = process.env.CLIENT_URL ?? "http://localhost:3000,http://localhost:3001";
  clientUrl.split(",").forEach((u) => origins.add(u.trim()));

  if (process.env.VERCEL_URL) {
    origins.add(`https://${process.env.VERCEL_URL}`);
  }

  const vercelUrls = process.env.VERCEL_URLS ?? process.env.ADDITIONAL_CORS_ORIGINS ?? "";
  vercelUrls.split(",").forEach((u) => {
    const trimmed = u.trim();
    if (!trimmed) return;
    origins.add(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
  });

  // Vercel preview/production patterns
  origins.add("https://*.vercel.app");

  if (process.env.CORS_ORIGIN) {
    process.env.CORS_ORIGIN.split(",").forEach((u) => origins.add(u.trim()));
  }

  return [...origins];
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parseInt(process.env.PORT ?? "4000", 10),
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:3000,http://localhost:3001",
  corsOrigins: parseCorsOrigins(),
  mongodbUri: required("MONGODB_URI", "mongodb://localhost:27017/rapidaid"),
  jwtSecret: required("JWT_SECRET", "dev-secret-change-in-production"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
  otpDevMode: process.env.OTP_DEV_MODE === "true",
  smtpHost: process.env.SMTP_HOST,
  smtpPort: parseInt(process.env.SMTP_PORT ?? "587", 10),
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  emailFrom: process.env.EMAIL_FROM ?? "RapidAid <noreply@rapidaid.in>",
  appUrl: process.env.APP_URL ?? "http://localhost:3000",
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  claudeModel: process.env.CLAUDE_MODEL ?? "claude-sonnet-4-20250514",
  nearestAmbulanceRadiusKm: parseFloat(process.env.NEAREST_AMBULANCE_RADIUS_KM ?? "20"),
  isProd: process.env.NODE_ENV === "production",
};
