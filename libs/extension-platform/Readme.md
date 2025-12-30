# Extension Platform

A minimal, focused system for managing extensions and services in a TypeScript
application.
Used for building modular monolith frontends in TypeScript.

## What it is

This library provides a small and explicit system for declaring extensions and
organizing them around well-defined contribution points. It's designed for apps
that want modularity without introducing a framework.

You can structure your frontend as a set of isolated feature modules, each one
contributing routes, services, UI fragments, or domain logic through extension
points.

This library provides two independent registries:

- `ExtensionRegistry`: allows registration and grouping of extensions by target,
  manages contributions.
- `ServiceRegistry`: manages instantiation, lifecycle, and dependency resolution
  of services.

Each registry is designed to remain immutable once the platform starts, reducing
runtime side effects and making the behavior predictable.

## What it’s for

It's designed for tools, frameworks, or applications that need to expose
well-defined extension points without coupling consumers to internal
implementation. It works well for plugin systems, modular CLI tools, or any
codebase where extensibility needs to stay explicit and lightweight.

## Why it’s useful

- Keeps implementation and usage decoupled.
- Makes extensions and services easy to test and mock.
- Supports clean lifecycle management without overhead.
- Doesn’t assume a framework or execution environment.
- Keeps code readable and close to the logic.
- Compatible with static bundling: all extensions are declared upfront, no
  runtime plugin loader required.
- No decorator, no magic.

## What makes it different

It doesn’t try to be a general-purpose DI container or a framework. It avoids
runtime magic, decorators, or reflection. You keep full control over what’s
registered, when, and how.

The result: a predictable, maintainable, and low-friction extensibility model.
You get structure without lock-in, and a platform that stays transparent.

## How to use

Everything is an extension.

Let’s say we want to build a “Hello World” system that aggregates hello messages
from multiple modules.

```typescript
import { Extension, ContributionPoint, ServiceConstructorProps, serviceRef } from "@seij/extension-platform";

// First, define an interface that all extensions will implement to contribute
// This is the contract of the contribution point
interface HelloContribution {
  helloMessage: string;
}

// Declares the contribution point that all other extensions can reference
// when they will declare their contributions
const HelloContributionPoint: ContributionPoint<HelloContribution> = { code: "hellos" };

// Create a service that will aggregate contributions from all extensions
class HelloService {
  helloContributions: HelloContribution[];

  constructor(props: ServiceConstructorProps) {
    // Gets all contributions from all modules plugged here
    this.helloContributions = props.extensionRegistry.findContributions(HelloContributionPoint);
  }

  sayHello() {
    // returns ["Bonjour", "Hello"] , an array of all hello messages from all contributors
    return this.helloContributions.map((it) => it.helloMessage);
  }
}

// Create a reference to this service (Javascript language limitations makes this kind of declaration necessary)
export const HelloServiceRef = serviceRef<HelloService>("HelloService");

// Declares the extension
const HellosExtension: Extension = {
  name: "hello-extension",
  activate(context) {
    // Registers the service
    context.registerService(HelloServiceRef, HelloService);
    // Registers the contribution point
    context.registerContributionPoint(HelloContributionPoint);
  },
};
```

Then another module contributes some hellos:

```typescript
import { Extension } from "@seij/extension-platform";

const HelloFromStrings: Extension = {
  name: "hello-from-strings",
  activate(context) {
    context.register(HelloContributionPoint, { helloMessage: "Bonjour" });
    context.register(HelloContributionPoint, { helloMessage: "Hello" });
  },
};
```

Wire everything:

```typescript
import { createExtensionPlatform } from "@seij/extension-platform";

const platform = createExtensionPlatform([HellosExtension, HelloFromStrings]);

const helloService = platform.resolve(HelloService);
helloService.sayHello();

// → Bonjour
// → Hello
```

# Design choices

- Extensions are declared statically and activated synchronously.
- All contributions are collected at startup. No discovery or reload at runtime.

This makes the system predictable, fast, and easy to debug — especially in
codebases where everything is built and bundled together.

# Not a framework

This isn’t a plugin loader or a dependency injection container. It doesn’t
manage UI, routing, or state. It just helps you structure your app around clear
extension points.

You stay in control.

## Ecosystem usage (real example)

This platform powers a runtime UI stack:

- [entity-graph](../entity-graph/README.md) ingests domain model definitions
  from backends (bounded contexts) and exposes entities,
  properties, and relationships at runtime.
- [entity-storage](../entity-storage/README.md) provides data access for those
  entities (fetch/search/create/update/delete), routed by
  entityName.
- `gen-ui` (will be published later) consumes both: it builds baseline screens
  from the graph and uses storage to load/mutate data, then
  lets modules enrich those screens through contribution points (actions,
  panels, visuals, buttons).

In short: one extension system connects model → data → UI and keeps each layer
extensible without hardcoding
all per‑entity screens.

Our goal is to automate the 90% of classic UI work, leaving the rest to
extensions and focusing on business logic and domain-specific UI/tooling.
