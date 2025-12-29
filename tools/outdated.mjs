#!/usr/bin/env node

/**
 * Script that checks versions of oudated packages.
 *
 * This is necessary since in a monorepo, "pnpm outdated" doesn't check
 * overrides and recursive check for installed packages is hell.
 *
 * Note that a file named `outdated-cache.json` is stored at the root of the
 * project (and added to .gitignore) so that package resolution via npm is
 * done only once per day per package.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, "..");
const CACHE_FILE = path.join(ROOT_DIR, ".outdated-cache.json");
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "package.json"), "utf8"));

const sections = ["dependencies", "devDependencies", "optionalDependencies"];
const entries = new Map();

const isWorkspaceLike = (range) => typeof range === "string" && /^(workspace|file|link):/.test(range);

function record(name, range, source) {
  if (isWorkspaceLike(range)) return;
  const existing = entries.get(name);
  if (!existing || source === "override") {
    entries.set(name, { range, source });
  }
}

for (const section of sections) {
  const deps = pkg[section];
  if (!deps) continue;
  for (const [name, range] of Object.entries(deps)) {
    record(name, range, section.replace("Dependencies", "") || section);
  }
}

const overrides = pkg.pnpm?.overrides;
if (overrides) {
  for (const [name, range] of Object.entries(overrides)) {
    record(name, range, "override");
  }
}

function findInstalledVersion(name) {
  try {
    const json = execSync(`pnpm list --recursive --depth -1 --json ${name}`, {
      cwd: ROOT_DIR,
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    });
    const data = JSON.parse(json) || [];
    for (const pkg of data) {
      if (pkg.name === name && pkg.version) return pkg.version;
      const maps = [pkg.dependencies, pkg.devDependencies, pkg.optionalDependencies];
      for (const m of maps) {
        const dep = m?.[name];
        if (dep?.version) return dep.version;
      }
    }
  } catch {
    return "";
  }
  return "";
}

function findLatestVersion(name) {
  console.log("Finding lastest version of " + name)
  const now = Date.now();
  const cache = loadCache();
  const entry = cache[name];
  if (entry && entry.latest && now - entry.fetchedAt < CACHE_TTL_MS) {
    console.log("Finding lastest version of " + name+ "from cache: " + entry.latest)
    return entry.latest;
  }

  try {
    const latest = execSync(`pnpm view ${name} version`, {
      cwd: ROOT_DIR,
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim();
    cache[name] = { latest, fetchedAt: now };
    saveCache(cache);
    return latest;
  } catch {
    return entry?.latest || "";
  }
}

const rows = [];
for (const [name, info] of entries.entries()) {
  const installed = findInstalledVersion(name) || "-";
  const latest = findLatestVersion(name) || "-";
  rows.push({
    name,
    source: info.source,
    requested: info.range,
    installed,
    latest,
    update: installed !== "-" && latest !== "-" && installed !== latest,
  });
}

const col = (value, width) => String(value).padEnd(width, " ");
const headers = ["package", "source", "requested", "installed", "latest"];
const widths = [40, 12, 18, 12, 12];
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

console.log(headers.map((h, i) => col(h, widths[i])).join(" "));
console.log(widths.map((w) => "-".repeat(w)).join(" "));

for (const row of rows) {
  const line = [
    col(row.name, widths[0]),
    col(row.source, widths[1]),
    col(row.requested, widths[2]),
    col(row.installed, widths[3]),
    col(row.latest, widths[4]),
  ].join(" ");
  console.log(row.update ? `${YELLOW}${line}${RESET}` : line);
}

function loadCache() {
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch {
    // best-effort cache; ignore errors
  }
}
