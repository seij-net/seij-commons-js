#!/usr/bin/env node

/**
 * Publishes all libs to npm in topological order (dependencies first).
 *
 * For each package, pushes a git tag to trigger the GitHub Actions publish workflow
 * and waits for npm to confirm availability before moving to the next one.
 *
 * Usage: node tools/publish-all.mjs
 */

import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { publishTag } from "./publish-tag.mjs";

const root = resolve(import.meta.dirname, "..");
const libsDir = join(root, "libs");

/** Loads all lib package.json files, returns array of { module, pkg } */
function loadLibs() {
  return readdirSync(libsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => ({
      module: d.name,
      pkg: JSON.parse(readFileSync(join(libsDir, d.name, "package.json"), "utf-8")),
    }))
    .filter(({ pkg }) => pkg.name && !pkg.private);
}

/**
 * Returns the list of { module, pkg } sorted in topological order:
 * packages with no @seij/* dependencies come first.
 * @param {{ module: string, pkg: object }[]} libs
 */
function topologicalSort(libs) {
  const byName = new Map(libs.map((l) => [l.pkg.name, l]));
  const visited = new Set();
  const result = [];

  function visit(lib) {
    if (visited.has(lib.pkg.name)) return;
    visited.add(lib.pkg.name);

    const allDeps = {
      ...lib.pkg.dependencies,
      ...lib.pkg.peerDependencies,
    };

    for (const dep of Object.keys(allDeps ?? {})) {
      if (byName.has(dep)) visit(byName.get(dep));
    }

    result.push(lib);
  }

  for (const lib of libs) visit(lib);
  return result;
}

const libs = loadLibs();
const ordered = topologicalSort(libs);

console.log("Publication order:");
ordered.forEach(({ module, pkg }, i) => console.log(`  ${i + 1}. ${pkg.name} (${module})`));
console.log("");

for (const { module, pkg } of ordered) {
  console.log(`\n─── Publishing ${pkg.name} ───`);
  try {
    await publishTag(module);
  } catch (err) {
    if (err.message.includes("already published on npm")) {
      console.log(`Skipping: ${err.message}`);
    } else {
      throw err;
    }
  }
}

console.log("\nAll packages published.");
