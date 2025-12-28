# common-types

Shared TypeScript primitives and utility types used across Seij projects, with a
focus on business data and date/time handling.

## What it provides

- `Problem` and `toProblem` helpers to normalize errors into a consistent shape, following the [RFC 7807](https://tools.ietf.org/html/rfc7807) standard.
- `throwError` for inline error throwing with correct TypeScript control-flow
  typing.
- Date and time primitives and helpers for `LocalDate`, `LocalDateTime`, month
  and year utilities, and common formatting helpers (French locale, for now).
- Money, currency, percent, and numeric formatting helpers.
- Small data primitives like `Instant`, `Int`, `Long`, and `Month`.
