# common-services

Shared service and text utilities used across Seij projects.

## What it provides

- `Connection`: a small fetch wrapper that builds standard JSON headers, injects
  a bearer token when available, and normalizes error handling with `Problem`
  from `@seij/common-types`.
- `defaultConnection`: a reconfigurable singleton connection for apps that want
  a shared API entry point.
- `searchFilter` and `naturalize`: helpers for user-facing search (case/diacritic
  normalization and simple filtering across fields).
