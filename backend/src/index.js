import http from "http";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { createApp } from "./app.js";
import { initSocket } from "./socket/index.js";

async function main() {
  await connectDB();

  const app = createApp();
  const server = http.createServer(app);

  initSocket(server, app);

  server.listen(env.port, () => {
    console.log(`RapidAid API listening on port ${env.port}`);
    console.log(`Environment: ${env.nodeEnv}`);
    console.log(`CORS: ${env.clientUrl}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
