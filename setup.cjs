#!/usr/bin/env node

// "setup": "npm i && npm run build && cd example && npm i",
const { readdirSync, statSync } = require("fs");
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

const examplesDir = join(__dirname, "./examples");
readdirSync(examplesDir).forEach((name) => {
  const dir = join(examplesDir, name);
  if (statSync(dir).isDirectory()) {
    console.log(`↪ installing in ${dir}`);
    execSync("npm install", { cwd: dir, stdio: "inherit" });
  }
});
