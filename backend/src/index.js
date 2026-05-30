import http from "http";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { createApp } from "./app.js";
import { initSocket } from "./socket/index.js";

async function main() {
  let dbReady = false;

  try {
    const { mode } = await connectDB();
    dbReady = true;

    if (mode === "memory") {
      const { seedDatabase } = await import("./scripts/seed-data.js");
      const result = await seedDatabase();
      if (result.seeded) {
        console.log("Auto-seeded demo accounts (password123):");
        console.log("  Citizen:", result.accounts.citizen);
        console.log("  Ambulance:", result.accounts.ambulance);
        console.log("  Hospital:", result.accounts.hospital);
      }
    }
  } catch (err) {
    console.warn("\nMongoDB unavailable — starting in stub mode (demo login only).");
    console.warn("  Full demo works at http://localhost:3001/demo without the API.\n");
    const { enableStubMode } = await import("./config/stub-db.js");
    enableStubMode();
  }

  const app = createApp();
  const server = http.createServer(app);

  if (dbReady) {
    initSocket(server, app);
  } else {
    console.log("Socket.io disabled in stub mode");
  }

  server.listen(env.port, () => {
    console.log(`RapidAid API listening on http://localhost:${env.port}`);
    console.log(`Health check: http://localhost:${env.port}/health`);
    console.log(`Environment: ${env.nodeEnv}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
