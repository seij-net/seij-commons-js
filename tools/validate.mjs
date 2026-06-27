#!/usr/bin/env node

/**
 * Workspace validation script.
 *
 * Each rule is a function (pkg, context) => string[]
 * returning a list of error messages for that package.
 * An empty list means the package passes the rule.
 *
 * Add new rules to the RULES array at the bottom.
 */

import { readdirSync, readFileSync } from "fs";
import { join, resolve } from "path";

// ---------------------------------------------------------------------------
// Loading
// ---------------------------------------------------------------------------

const root = resolve(import.meta.dirname, "..");
const rootPkg = JSON.parse(readFileSync(join(root, "package.json"), "utf-8"));

function loadLibPackages() {
  const libsDir = join(root, "libs");
  return readdirSync(libsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const pkgPath = join(libsDir, d.name, "package.json");
      return JSON.parse(readFileSync(pkgPath, "utf-8"));
    });
}

// ---------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------

/**
 * Every lib must declare seij.multipleVersionSafePackage as a boolean.
 */
function checkMultipleVersionSafePackage(pkg) {
  const value = pkg?.seij?.multipleVersionSafePackage;
  if (value === undefined || value === null) return [`seij.multipleVersionSafePackage is not set`];
  if (typeof value !== "boolean")
    return [`seij.multipleVersionSafePackage must be a boolean, got ${JSON.stringify(value)}`];
  return [];
}

/**
 * Two checks in one:
 * 1. External packages listed in root seij.mustBeInPeerDependencies must never
 *    appear in dependencies or devDependencies — only in peerDependencies.
 * 2. Internal @seij/* packages with multipleVersionSafePackage: false must also
 *    be in peerDependencies, not in dependencies or devDependencies.
 */
function checkMustBeInPeerDependencies(pkg, { mustBeInPeerDependencies, internalPackages }) {
  const deps = Object.keys(pkg.dependencies ?? {});
  const devDeps = Object.keys(pkg.devDependencies ?? {});
  const errors = [];

  for (const name of mustBeInPeerDependencies) {
    if (deps.includes(name)) errors.push(`"${name}" must be in peerDependencies, found in dependencies`);
    if (devDeps.includes(name)) errors.push(`"${name}" must be in peerDependencies, found in devDependencies`);
  }

  for (const name of [...deps, ...devDeps]) {
    const internal = internalPackages.get(name);
    if (internal?.seij?.multipleVersionSafePackage === false) {
      const location = deps.includes(name) ? "dependencies" : "devDependencies";
      errors.push(
        `"${name}" has multipleVersionSafePackage: false and must be in peerDependencies, found in ${location}`,
      );
    }
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

const RULES = [checkMultipleVersionSafePackage, checkMustBeInPeerDependencies];

export function validate() {
  const packages = loadLibPackages();
  const context = {
    mustBeInPeerDependencies: rootPkg?.seij?.mustBeInPeerDependencies ?? [],
    internalPackages: new Map(packages.map((p) => [p.name, p])),
  };

  let totalErrors = 0;

  for (const pkg of packages) {
    const errors = RULES.flatMap((rule) => rule(pkg, context));
    if (errors.length === 0) {
      console.log(`✅  ${pkg.name}`);
    } else {
      console.error(`❌  ${pkg.name}`);
      for (const err of errors) {
        console.error(`      • ${err}`);
      }
      totalErrors += errors.length;
    }
  }

  console.log("");
  if (totalErrors > 0) {
    console.error(`${totalErrors} error(s) found across ${packages.length} packages.`);
    return false;
  }

  console.log(`All ${packages.length} packages are valid.`);
  return true;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (!validate()) process.exit(1);
}
