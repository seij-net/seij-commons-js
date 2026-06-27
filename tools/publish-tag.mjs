#!/usr/bin/env node

/**
 * Tags a module for publishing and waits for it to be available on npm.
 *
 * Steps:
 * 1. Validates the module exists and has a package.json with name and version.
 * 2. Checks if the version is already published on npm.
 * 3. Deletes existing local and remote tags for this module/version (if any).
 * 4. Creates a new git tag in the format: libs/<module>/v<version>
 * 5. Pushes the tag to the remote repository.
 * 6. Polls npm until the new version is available (up to 5 minutes).
 *
 * Usage: node tools/publish-tag.mjs <module-name>
 * Example: node tools/publish-tag.mjs common-types
 */

import { execFileSync, execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

/** Runs a shell command, printing output to the terminal. Throws on non-zero exit code. */
function run(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

/** Returns true if <packageName>@<version> exists on npm, false otherwise. */
function npmViewVersion(packageName, version) {
  try {
    execFileSync("npm", ["view", `${packageName}@${version}`, "version"], {
      stdio: ["ignore", "ignore", "ignore"],
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks that the version is not already published on npm with the version number present in package.json of the
 * module to publish. If already published, stop everything.
 *
 * Then deletes any existing git tag for the given module/version (local and remote), pushes a new tag to trigger
 * the GitHub Actions publish workflow, and polls npm until the version is available (up to 5 minutes).
 *
 * @param {string} module - The module directory name under libs/ (e.g. "common-types")
 * @throws If the module is not found, already published, or npm does not confirm within 5 minutes.
 */
export async function publishTag(module) {
  const moduleDir = join(root, "libs", module);
  const packageJsonPath = join(moduleDir, "package.json");

  if (!existsSync(moduleDir)) {
    throw new Error(`Module directory not found: libs/${module}`);
  }
  if (!existsSync(packageJsonPath)) {
    throw new Error(`package.json not found: libs/${module}/package.json`);
  }

  const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
  const packageName = pkg.name;
  const version = pkg.version;

  if (!packageName) throw new Error(`Package name missing in libs/${module}/package.json`);
  if (!version) throw new Error(`Version missing in libs/${module}/package.json`);

  if (npmViewVersion(packageName, version)) {
    throw new Error(`${packageName}@${version} is already published on npm.`);
  }

  const tag = `libs/${module}/v${version}`;

  const localTagExists = execSync(`git tag -l "${tag}"`, { encoding: "utf-8" }).trim() === tag;
  if (localTagExists) run(`git tag -d "${tag}"`);

  const remoteTagExists = execSync(`git ls-remote --tags origin "${tag}"`, { encoding: "utf-8" }).trim() !== "";
  if (remoteTagExists) run(`git push origin --delete "${tag}"`);

  run(`git tag "${tag}"`);
  run(`git push origin "${tag}"`);

  const timeoutMs = 300_000;
  const intervalMs = 15_000;
  const deadline = Date.now() + timeoutMs;

  console.log(`Waiting for ${packageName}@${version} to be published on npm (timeout: ${timeoutMs / 1000}s)...`);

  while (Date.now() < deadline) {
    if (npmViewVersion(packageName, version)) {
      console.log(`Published: ${packageName}@${version} is now available on npm.`);
      return;
    }
    const remaining = Math.ceil((deadline - Date.now()) / 1000);
    console.log(`Still not published. Retrying in ${intervalMs / 1000}s (remaining: ${remaining}s)...`);
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(`Timeout: ${packageName}@${version} not published after ${timeoutMs / 1000}s.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const module = process.argv[2];
  if (!module) {
    console.error("Usage: node tools/publish-tag.mjs <module>");
    console.error("Example: node tools/publish-tag.mjs common-types");
    process.exit(1);
  }
  publishTag(module).catch((err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });
}
