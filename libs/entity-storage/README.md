# entity-storage

Runtime storage layer for entity instances, designed to pair with
`entity-graph`. While `entity-graph` describes *what* exists (entities,
properties, relationships), `entity-storage` defines *how* to fetch, search,
create, update, and delete the actual data.

## What it provides

- A contribution-based registry for entity storage implementations.
- A single service (`EntityStorageService`) to route CRUD operations by entity
  name.
- DTOs for list, pagination, and single-item responses.
- Query key helpers to support cache invalidation (e.g., React Query).
- Optional mapping helpers for aggregate fetch results.

## What it is (and how it differs from usual approaches)

Most applications hardcode a repository or API client per entity, tied to a
single backend and a fixed schema. This module is different: it routes data
access by `entityName` at runtime, using contributions that can come from
multiple bounded contexts. That makes it a storage *platform* rather than a
collection of static services.

The real power comes from its link to `entity-graph`: the graph tells the UI
what entities exist and how they relate; the storage tells the UI where to fetch
and mutate the data. Together, they turn a dynamic domain model into a working
dynamic UI without hardcoding endpoints or per-entity services.

Concrete outcomes: fewer per-entity repositories, consistent data access across
domains, and faster delivery of baseline screens (lists, detail, edit).

## Why it matters

- Separates *model discovery* (entity-graph) from *data access* (entity-storage).
- Lets multiple backends or storage strategies coexist behind one API.
- Enables dynamic UI to load and mutate entity data without hardcoding
  endpoints.
- Provides consistent cache keys and invalidation hooks across entities.

## How it works

- Extensions contribute a storage implementation per entity name.
- The storage exposes `fetchItem`, `search`, `createItem`, `updateItemProperty`,
  and `deleteItem`.
- The service resolves the right store by entity name and forwards calls.
- Additional invalidation keys can be contributed for cross-query consistency.
