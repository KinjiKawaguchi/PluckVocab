# ADR-003: Vocab as ReadonlyMap

## Status

Superseded by [ADR-006](006-vocab-as-immutable-class.md)

## Context

Vocab (vocabulary collection) needs an internal representation. Main operations:

- Lookup word (O(1) needed)
- Ensure word uniqueness
- Iterate for display

Options considered:

- `ReadonlyArray<VocabRecord>`: Simple, JSON-friendly
- `ReadonlyMap<Word, ReadonlyArray<Pluck>>`: Enforces uniqueness structurally

## Decision

Use `ReadonlyMap<Word, ReadonlyArray<Pluck>>`.

The Map structure guarantees each Word appears exactly once, encoding the domain rule in the data structure itself.

## Consequences

### Positive

- Lookup and uniqueness checking are O(1)
- The domain rule "each word appears once in vocab" is enforced by the data structure, not by business logic

### Negative

- JSON serialization requires Map↔Array conversion in the infrastructure/storage layer
