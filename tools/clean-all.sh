#!/usr/bin/env bash
set -euo pipefail

# Clean the repository as if freshly checked out: remove installs, builds and caches.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

rm -rf "${ROOT_DIR}/node_modules" "${ROOT_DIR}/.turbo"


find "${ROOT_DIR}" -maxdepth 3 -type d \( \
  -name node_modules -o \
  -name dist -o \
  -name .turbo \
\) -prune -exec rm -rf '{}' +
