import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { viteEnvFromNext } from "./load-env.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const viteEnv = viteEnvFromNext();

function run(cmd, cwd, extraEnv = {}) {
  execSync(cmd, {
    cwd,
    stdio: "inherit",
    env: { ...process.env, CI: "true", ...extraEnv },
  });
}

function copyDir(src, dest) {
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(src, dest, { recursive: true });
}

console.log("Generating PWA icons…");
run("node scripts/generate-pwa-icons.mjs", root);

console.log("Building Citizen PWA…");
run("npm run build", path.join(root, "citizen-pwa"), {
  VITE_BASE_PATH: "/citizen/",
  ...viteEnv,
});

console.log("Building Ambulance PWA…");
run("npm run build", path.join(root, "ambulance-pwa"), {
  VITE_BASE_PATH: "/ambulance/",
  ...viteEnv,
});

const publicCitizen = path.join(root, "public", "citizen");
const publicAmbulance = path.join(root, "public", "ambulance");

copyDir(path.join(root, "citizen-pwa", "dist"), publicCitizen);
copyDir(path.join(root, "ambulance-pwa", "dist"), publicAmbulance);

console.log("PWAs copied to public/citizen and public/ambulance");
