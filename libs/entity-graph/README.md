# entity-graph

Runtime entity graph for business domains. It builds a live model from DTOs
provided by backend services (bounded contexts). Those DTO provides abstract
definitions of a domain model (not the data, the definitions), so the UI can
discover entities, properties, and relationships on the fly and generate screens
dynamically.

## What it provides

- DTOs and interfaces to describe entities and their properties.
- Relationship definitions with cardinality (to-one / to-many).
- A registry that assembles entities and relationships from extension
  contributions.
- Type-based validation hooks for property values.
- Helpers to build default values for entity creation.

## Why use it

- Consume backend-provided model descriptions (DTOs) per bounded context.
- Discover available entities and relationships at runtime.
- Generate baseline UI (lists, forms, detail views) from metadata.
- Keep validation and field metadata consistent across screens.
- Scale across many models and multiple apps without hardcoding schemas.

## Benefits

- Faster UI delivery: a generic UI can be generated from the graph.
- Reduced duplication: one model description feeds multiple screens and apps.
- Safer changes: new fields or entities appear without rewriting UI logic.
- Extensible types: validation and behavior can be added per type via
  extensions.

## What is truly novel here

- **Runtime domain model driven by backends**: most tools start from a central
  schema (DB, OpenAPI, JSON Schema). Here, the schema comes from bounded
  contexts themselves and can be composed dynamically on the frontend. It is
  more DDD-aligned than most generators.
- **Entity graph + extensible type validation**: not just a “schema”, but a
  usable graph (relations + cardinalities) and behavior per type. This unlocks a
  truly generic UI (navigation, CRUD, validation) without hardcoded domain
  conditionals.
- **Contribution-based (plugin-based) extensibility**: entities, relationships,
  and types are extendable via a contribution mechanism, so new domains or new
  sources of descriptions, can be added without touching the core. It is a
  platform model rather than a simple library.

## Blind spot covered compared to similar tools

- **Multi-domain / multi-backend**: most tools assume a single central model (or
  one backend). Here, you can aggregate several sources and compose the graph.
- **Truly runtime UI**: many tools generate code from a schema. Here, the
  application adapts at runtime, which is useful when models change often or
  when each client has a different scope.
- **Consistent, delegated validation**: validation is carried by the type
  system, not rewritten in each form. This reduces drift between UI and domain
  rules.

In short: the novelty is not a tool for “generating forms”, but having a frontend that
adapts to a dynamic, multi-source domain model with an extensible type system.

That combination is rare.

## How it works

- Entities and relationships are declared as DTOs coming from backends.
- Extensions contribute entity, relationship, and type definitions.
- The `EntityGraph` service builds a graph, checks for duplicates, and validates
  that all property types are handled.
- Property definitions expose validation through type extensions.
