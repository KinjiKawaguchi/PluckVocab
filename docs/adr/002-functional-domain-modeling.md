# ADR-002: Functional Domain Modeling

## Status

Accepted

## Context

TypeScript supports both OOP (interface, class) and FP (type, pure functions) paradigms. We need a modeling approach for the vocabulary domain that ensures type safety and testability.

## Decision

Use Functional Domain Modeling:

- All domain types use `type` (not `interface`)
- Use Branded Types (Word, PluckedAt, SourceUrl, SourceTitle) to make illegal states unrepresentable at the type level
- Use `Result<T,E>` for error handling as values
- Smart constructors for validated type creation
- All domain operations are pure functions

## Consequences

### Positive

- Type-level safety catches bugs at compile time
- Domain functions are easy to test (pure, no side effects)
- Illegal states become unrepresentable

### Negative

- Branded types add construction overhead (smart constructors required)

### Update (ADR-006)

Vocab was converted from a type alias with standalone functions to an immutable class with methods. This maintains FDM's core guarantees (immutability, purity, branded types) while providing aggregate root ergonomics. See ADR-006.
