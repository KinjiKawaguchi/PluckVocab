# ADR-006: Vocab as Immutable Class

## Status

Accepted (supersedes [ADR-003](003-vocab-as-readonly-map.md))

## Context

Vocab was a type alias (`ReadonlyMap<Word, ReadonlyArray<Pluck>>`) with standalone pure functions (`addToVocab`, `removeFromVocab`, `emptyVocab`). This followed strict FDM style but had drawbacks:

- Operations read as `addToVocab(vocab, word, pluck)` instead of `vocab.add(word, pluck)`
- Display logic (sorting) leaked into UI components instead of living with the aggregate
- Internal representation (ReadonlyMap) was fully exposed to consumers

## Decision

Convert Vocab to an immutable class with methods that return new instances:

- `Vocab.empty()`, `Vocab.fromEntries()` — static constructors
- `vocab.add(word, pluck)`, `vocab.remove(word)` — return new Vocab
- `vocab.isEmpty`, `vocab.size` — read-only properties
- `vocab.toSorted()` — domain-owned display ordering
- `vocab[Symbol.iterator]()` — serialization support

The class uses a private constructor, preserving the smart constructor pattern from FDM. All methods are pure — they never mutate `this`.

## Consequences

### Positive

- Aggregate root ergonomics: operations read naturally as `vocab.add(...)`, `vocab.remove(...)`
- Encapsulation: ReadonlyMap is an internal implementation detail
- Sort logic moved from VocabList into Vocab where it belongs
- FDM guarantees preserved: immutability, purity, branded types

### Negative

- Domain code now contains a class (previously type aliases only)
- `Vocab` is a value but not structurally comparable (`===` checks reference identity, not content)
