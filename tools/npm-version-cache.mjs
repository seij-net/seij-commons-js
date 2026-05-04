import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, "..");
const CACHE_FILE = path.join(ROOT_DIR, ".outdated-cache.json");
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

export function findLatestVersion(name) {
  const now = Date.now();
  const cache = loadCache();
  const entry = cache[name];

  if (entry && entry.latest && now - entry.fetchedAt < CACHE_TTL_MS) {
    return entry.latest;
  }

  try {
    const latest = execFileSync("pnpm", ["view", name, "version"], {
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
