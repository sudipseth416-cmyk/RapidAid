import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const citizenMarker = path.join(root, "public", "citizen", "index.html");
const ambulanceMarker = path.join(root, "public", "ambulance", "index.html");

if (!fs.existsSync(citizenMarker) || !fs.existsSync(ambulanceMarker)) {
  console.log("PWA assets missing — building citizen & ambulance apps…");
  execSync("npm run build:pwas", { cwd: root, stdio: "inherit" });
} else {
  console.log("PWA assets found in public/citizen and public/ambulance");
}
