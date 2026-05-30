import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Load KEY=VALUE pairs from .env.local and .env into process.env (no overwrite). */
export function loadEnvFiles() {
  for (const file of [".env.local", ".env"]) {
    const filePath = path.join(root, file);
    if (!fs.existsSync(filePath)) continue;
    for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = value;
    }
  }
}

export function viteEnvFromNext() {
  loadEnvFiles();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:4000";
  return {
    VITE_API_URL: apiUrl,
    VITE_SOCKET_URL: socketUrl,
  };
}
