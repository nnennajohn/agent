#!/usr/bin/env node

// "setup": "npm i && npm run build && cd example && npm i",
const { join } = require("path");
const { execSync } = require("child_process");

console.log("Installing dependencies for the Agent component...");
execSync("npm install", { cwd: __dirname, stdio: "inherit" });
console.log("✅\n");
console.log("Building the Agent component...");
execSync("npm run build", { cwd: __dirname, stdio: "inherit" });
console.log("✅\n");
console.log("Installing dependencies for the playground...");
execSync("npm install", {
  cwd: join(__dirname, "./playground"),
  stdio: "inherit",
});
console.log("✅\n");
console.log("Installing dependencies for the example...");
execSync("npm install", {
  cwd: join(__dirname, "./example"),
  stdio: "inherit",
});
console.log("✅\n");
console.log("Now run: npm run dev");
