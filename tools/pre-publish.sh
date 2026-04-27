#!/usr/bin/env bash

set -euo pipefail

pnpm run format
pnpm run typecheck
pnpm run lint
pnpm run build
pnpm run test

echo "Finished you can publish"
