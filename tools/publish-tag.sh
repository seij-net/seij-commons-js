#!/usr/bin/env bash
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
