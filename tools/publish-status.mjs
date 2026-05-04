#!/usr/bin/env node

/**
 * Script that compares each libs package version with the latest version
 * available on npm.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { findLatestVersion } from "./npm-version-cache.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, "..");
const LIBS_DIR = path.join(ROOT_DIR, "libs");

function readPackage(packageJsonPath) {
  try {
    return JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  } catch {
    return {};
  }
}

const rows = [];

for (const module of fs.readdirSync(LIBS_DIR).sort()) {
  const moduleDir = path.join(LIBS_DIR, module);
  const packageJsonPath = path.join(moduleDir, "package.json");

  if (!fs.statSync(moduleDir).isDirectory() || !fs.existsSync(packageJsonPath)) {
    continue;
  }

  const pkg = readPackage(packageJsonPath);
  const name = pkg.name || "-";
  const local = pkg.version || "-";
  const isPrivate = pkg.private === true;

  if (!pkg.name) {
    rows.push({ module, name, local, latest: "-", status: "no-name" });
    continue;
  }

  if (isPrivate) {
    rows.push({ module, name, local, latest: "-", status: "private" });
    continue;
  }

  const latest = findLatestVersion(name);

  if (!latest) {
    rows.push({ module, name, local, latest: "-", status: "not-published" });
    continue;
  }

  rows.push({
    module,
    name,
    local,
    latest,
    status: local === latest ? "same" : "different",
  });
}

const col = (value, width) => String(value).padEnd(width, " ");
const headers = ["status", "package", "local version", "latest npm", "module"];
const widths = [15, 40, 14, 12, 24];
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

console.log(headers.map((header, i) => col(header, widths[i])).join(" "));
console.log(widths.map((width) => "-".repeat(width)).join(" "));

for (const row of rows) {
  const line = [
    col(row.status, widths[0]),
    col(row.name, widths[1]),
    col(row.local, widths[2]),
    col(row.latest, widths[3]),
    col(row.module, widths[4]),
  ].join(" ");

  console.log(row.status === "same" || row.status === "private" ? line : `${YELLOW}${line}${RESET}`);
}
