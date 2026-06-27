#!/usr/bin/env node

import { execSync } from "child_process";
import { validate } from "./validate.mjs";

function run(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

if (!validate()) process.exit(1);

run("pnpm run typecheck");
run("pnpm run lint");
run("pnpm run test");
run("pnpm run build");
run("pnpm exec prettier --check .");

console.log("\nFinished, you can publish.");
