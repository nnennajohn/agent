#!/usr/bin/env node

// "setup": "npm i && npm run build && cd example && npm i",
const { join } = require("path");
const { execSync } = require("child_process");

execSync("npm install", { cwd: __dirname, stdio: "inherit" });
execSync("npm run build", { cwd: __dirname, stdio: "inherit" });
execSync("npm install", {
  cwd: join(__dirname, "./playground"),
  stdio: "inherit",
});
execSync("npm install", {
  cwd: join(__dirname, "./example"),
  stdio: "inherit",
});
