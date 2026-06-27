#!/usr/bin/env node

import { execSync } from "child_process";
import { rmSync, readdirSync, statSync } from "fs";
import { join, resolve } from "path";
import { validate } from "./validate.mjs";

function run(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

const root = resolve(import.meta.dirname, "..");

function clean() {
  const toDelete = ["node_modules", ".turbo"];
  for (const name of toDelete) rmSync(join(root, name), { recursive: true, force: true });

  const libsDir = join(root, "libs");
  const targets = new Set(["node_modules", "dist", ".turbo", "storybook-static"]);
  for (const lib of readdirSync(libsDir)) {
    const libDir = join(libsDir, lib);
    if (!statSync(libDir).isDirectory()) continue;
    for (const target of targets) rmSync(join(libDir, target), { recursive: true, force: true });
  }
}

console.log("Cleaning...");
clean();
run("pnpm install");

if (!validate()) process.exit(1);

run("pnpm run typecheck");
run("pnpm run lint");
run("pnpm run test");
run("pnpm run build");
run("pnpm exec prettier --check .");

console.log("\nFinished, you can publish.");
