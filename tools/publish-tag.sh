#!/usr/bin/env bash
# This script tags a module for publishing and waits for it to be available on npm.
#
# It performs the following steps:
# 1. Validates the module exists and has a package.json with name and version.
# 2. Checks if the version is already published on npm.
# 3. Deletes existing local and remote tags for this module/version (if any).
# 4. Creates a new git tag in the format: libs/<module>/v<version>
# 5. Pushes the tag to the remote repository.
# 6. Polls npm until the new version is available (up to 5 minutes).
#
# Usage: ./tools/publish-tag.sh <module-name>
# Example: ./tools/publish-tag.sh common-types

set -euo pipefail

usage() {
  echo "Usage: $0 <module>"
  echo "Example: $0 common-types"
}

module="${1:-}"
if [[ -z "${module}" ]]; then
  usage
  exit 1
fi

module_dir="libs/${module}"
package_json="${module_dir}/package.json"

if [[ ! -d "${module_dir}" ]]; then
  echo "Error: module directory not found: ${module_dir}" >&2
  exit 1
fi

if [[ ! -f "${package_json}" ]]; then
  echo "Error: package.json not found: ${package_json}" >&2
  exit 1
fi

package_name="$(jq -r '.name' "${package_json}")"
version="$(jq -r '.version' "${package_json}")"

if [[ -z "${package_name}" || "${package_name}" == "null" ]]; then
  echo "Error: package name missing in ${package_json}" >&2
  exit 1
fi

if [[ -z "${version}" || "${version}" == "null" ]]; then
  echo "Error: version missing in ${package_json}" >&2
  exit 1
fi

if npm view "${package_name}@${version}" version >/dev/null 2>&1; then
  echo "Error: ${package_name}@${version} is already published on npm." >&2
  exit 1
fi

tag="libs/${module}/v${version}"

git tag -d "${tag}" >/dev/null 2>&1 || true
git push origin --delete "${tag}" >/dev/null 2>&1 || true
git tag "${tag}"
git push origin "${tag}"

timeout_seconds=300
interval_seconds=15
elapsed=0

echo "Waiting for ${package_name}@${version} to be published on npm (timeout: ${timeout_seconds}s, interval: ${interval_seconds}s)..."

while (( elapsed < timeout_seconds )); do
  if npm view "${package_name}@${version}" version >/dev/null 2>&1; then
    echo "Published: ${package_name}@${version} is now available on npm."
    exit 0
  fi

  remaining=$(( timeout_seconds - elapsed ))
  echo "Still not published. Retrying in ${interval_seconds}s (remaining: ${remaining}s)..."
  sleep "${interval_seconds}"
  elapsed=$(( elapsed + interval_seconds ))
done

echo "Timeout: ${package_name}@${version} not published after ${timeout_seconds}s." >&2
exit 1
