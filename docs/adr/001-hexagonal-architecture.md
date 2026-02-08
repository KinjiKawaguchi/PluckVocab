# ADR-001: Hexagonal Architecture

## Status

Accepted

## Context

PluckVocab is a Chrome extension that needs clean separation between domain logic, Chrome APIs, DOM rendering, and storage. The domain logic must be testable without Chrome runtime dependencies.

## Decision

Adopt Hexagonal Architecture (Ports & Adapters) with 3 layers:

- `domain/`: Pure business logic with zero dependencies
- `interface/`: Driving adapters (chrome/, ui/) that trigger domain operations
- `infrastructure/`: Driven adapters (storage/) that provide external services

Dependency direction: `interface/` → `domain/` ← `infrastructure/`

The `interface/` and `infrastructure/` layers never depend on each other.

## Consequences

### Positive

- Domain is testable with plain Bun (no Chrome runtime needed)
- Clear boundaries make it easy to swap storage backends or UI frameworks
- Domain logic remains pure and portable

### Negative

- More directories than a flat structure
- Additional indirection between layers
