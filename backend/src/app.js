import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import emergencyRoutes from "./routes/emergency.routes.js";
import ambulanceRoutes from "./routes/ambulance.routes.js";
import hospitalRoutes from "./routes/hospital.routes.js";
import aiRoutes from "./routes/ai.routes.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) return callback(null, true);
        const allowed = env.corsOrigins;
        if (allowed.includes(origin)) return callback(null, true);
        if (allowed.some((o) => o.includes("*.vercel.app") && /\.vercel\.app$/.test(origin))) {
          return callback(null, true);
        }
        if (!env.isProd) return callback(null, true);
        callback(new Error(`CORS blocked: ${origin}`));
      },
      credentials: true,
    })
  );
  app.use(morgan(env.isProd ? "combined" : "dev"));
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "rapidaid-api", timestamp: new Date().toISOString() });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/emergencies", emergencyRoutes);
  app.use("/api/ambulance", ambulanceRoutes);
  app.use("/api/hospital", hospitalRoutes);
  app.use("/api/ai", aiRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
