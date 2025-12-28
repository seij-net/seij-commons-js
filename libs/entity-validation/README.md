# entity-validation

Work in progress: validation layer that uses `entity-graph` and the type system
to validate entity instances at differnt stages of their lifecycle.

## What it provides today

- A service that resolves an entity definition from `entity-graph`.
- Validation functions for properties marked as `create`.
- Delegation of validation to type extensions (when available).

## Status

This module is still evolving. The current surface is minimal and focused on
creation validation only. Expect API changes and missing coverage for other
validation flows.

## Relationship to entity-graph

- `entity-graph` defines the model and property metadata.
- `entity-validation` uses that metadata to run type-driven validation.
