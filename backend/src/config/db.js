import mongoose from "mongoose";
import { env } from "./env.js";

let memoryServer = null;

export function isMemoryDb() {
  return !!memoryServer;
}

export async function connectDB() {
  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(env.mongodbUri, { serverSelectionTimeoutMS: 8000 });
    console.log("MongoDB connected");
    return { mode: "remote" };
  } catch (err) {
    const canFallback =
      !env.isProd && process.env.MONGODB_MEMORY_FALLBACK !== "false";

    if (canFallback) {
      console.warn("\nPrimary MongoDB unavailable — using in-memory database for local dev.");
      if (err?.code === "ECONNREFUSED" && err?.syscall === "querySrv") {
        console.warn("  (Atlas DNS lookup failed; data resets when the server stops.)\n");
      }

      const { MongoMemoryServer } = await import("mongodb-memory-server");
      memoryServer = await MongoMemoryServer.create({
        instance: { launchTimeout: 120000 },
      });
      await mongoose.connect(memoryServer.getUri(), { serverSelectionTimeoutMS: 10000 });
      console.log("In-memory MongoDB ready");
      return { mode: "memory" };
    }

    if (err?.code === "ECONNREFUSED" && err?.syscall === "querySrv") {
      console.error(
        "\nMongoDB Atlas DNS lookup failed (querySrv ECONNREFUSED).\n" +
          "  • Check internet connection and DNS\n" +
          "  • Whitelist your IP in Atlas Network Access\n" +
          "  • Or set MONGODB_MEMORY_FALLBACK=true for local in-memory DB\n"
      );
    }
    throw err;
  }
}
