# ADR-004: Pluck/Word Concept Separation

## Status

Accepted

## Context

Initially modeled "PluckedWord" as a single entity. However, "Pluck" (the act of selecting and saving) and "Word" (the vocabulary entry) are fundamentally different domain concepts:

- A Pluck is an event
- A Word is an entity in the vocab
- Same word can be plucked multiple times from different sources

## Decision

Separate Pluck from Word:

- `Pluck`: Domain event with `{ at: PluckedAt, source: Source }`
- `Word`: Branded string, serves as identity in Vocab
- `Vocab`: Maps `Word → ReadonlyArray<Pluck>`, preserving full pluck history per word

## Consequences

### Positive

- Clear event/entity separation
- Pluck history is preserved (not lost via upsert)
- Future additions (e.g., context, notes) extend Pluck type without structural changes
- Word text IS the identity (no need for separate WordId UUID)

### Negative

- More complex data structure than a flat list of PluckedWords
