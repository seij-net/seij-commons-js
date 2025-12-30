# @seij/common-ui-icons

This package provides a controlled, extensible, and bundle-friendly icon system
for frontend applications.

Its goal is **not** to expose an icon library, but to expose a **stable icon
contract** that decouples:

- applications from icon providers (FluentUI, SVGs, others),
- frontend from backend serialization,
- usage from implementation.

## Problem Statement

In many applications, icons are imported directly from UI libraries (e.g.
FluentUI). This creates several structural issues:

- Icon providers leak everywhere in the codebase.
- It is impossible to track or govern icon usage.
- Migrating away from a provider becomes costly.
- Multiple icon sets cannot be mixed cleanly.
- Backend-driven UIs cannot safely reference icons.
- Central registries break tree-shaking and inflate bundles.

This package addresses all of these problems explicitly.

## Core Principles

### 1. Icons are **intentions**, not assets

Applications never choose _where an icon comes from_.  
They choose _what the icon means_.

Examples:

- `"add"`
- `"delete"`
- `"user"`
- `"search"`

These names form a **closed, versioned contract**.

### 2. The contract is frontend-owned and backend-consumed

The backend serializes icon names as strings in DTOs.
It does not know about FluentUI, SVGs, or components.

The frontend validates and resolves these strings against its own contract.

### 3. No global imports, no central switch

Any implementation that imports all icons in one place:

- breaks tree-shaking,
- bundles unused icons,
- couples everything together.

Each icon must live in its **own ES module**.

### 4. Resolution is explicit and controlled

Icons are resolved:

- only through this package,
- only via known keys,
- only through a single component.

Applications are not allowed to import icon providers directly.

## Architecture

### Icon Contract

```ts
export const iconNames = ["add", "delete", "user", "search"] as const;
export type IconName = (typeof iconNames)[number];
```

This is the public API.

- Closed set
- Traceable
- Versionable
- Serializable

### Icon Implementations (isolated)

Each icon is implemented in its own module.

See [add.tsx](src/icons/add.tsx) for example.

Icons may come from:

- FluentUI
- custom SVGs
- other libraries

This choice is invisible to consumers.

### Loader Mapping (not components)

A [Loader](src/iconLoaders.tsx) maps icons names to dynamic import.

Why loaders:

- preserves tree-shaking,
- allows code-splitting,
- avoids global imports,
- keeps the contract closed.

A [preload](src/iconPreload.tsx) function is available to prevent flickering.
See comments on the function to know the use cases.

### <Icon /> Component

See [Icon.tsx](src/Icon.tsx)

- imports nothing concrete,
- only routes to a loader,
- enforces the contract.
- uses Suspense with a Placeholder to have deterministic positionning.

## Backend integration

This is an example.

```ts
type MenuItemDto = { label: string; icon?: string };
```

The backend sends a string key, nothing more.

In the frontend, decode icon with `parseIconName` then display icon:

```tsx
function MenuItem({ dto }: { dto: MenuItemDto }) {
  const iconName = parseIconName(dto.icon);

  return (
    <>
      {iconName && <Icon name={iconName} />}
      {dto.label}
    </>
  );
}
```

Just after you get the DTOs it's a best practise to use [preload](src/iconPreload.tsx)

## Application-Specific Icons

Applications must not extend the global icon contract.

Two cases:

- Purely local icons: Stay inside the application as local components.
- Reusable, product-level icons: Are explicitly promoted into this package by:
  - adding a new contract key,
  - choosing an implementation,
  - documenting usage.

This friction is intentional and healthy.

## Governance and Tooling

Recommended enforcement:

- ESLint rule forbidding direct imports from icon providers.
- No dynamic registration or plugin system.
- No fallback magic.

All icons must go through this package.

## Explicit Trade-offs

- Uses `React.lazy` and `Suspense`.
- Slight runtime indirection.
- Intentional friction when adding icons.

What you gain:

- clean bundling,
- provider independence,
- backend compatibility,
- traceability,
- long-term maintainability.

## Summary

This system treats icons as a domain language, not as UI assets.

Once that shift is accepted:

- FluentUI becomes an implementation detail, also SVG or others
- multiple icon sets coexist safely,
- backend-driven UIs work naturally,
- bundles stay minimal,
- migrations become mechanical.
