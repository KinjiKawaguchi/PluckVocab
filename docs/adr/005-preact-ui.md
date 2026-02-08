# ADR-005: Preact for UI Layer

## Status

Accepted

## Context

The UI layer (`interface/ui/`) used imperative DOM manipulation (`document.createElement`, `innerHTML`, `addEventListener`) to render vocabulary lists and handle user interactions. This approach required manual state-to-DOM synchronization: every state change needed explicit re-rendering of the entire container.

As the UI grows, imperative DOM code becomes harder to maintain:

- State and rendering logic are tightly coupled in procedural code
- No declarative mapping from data to view
- Manual DOM diffing (or full re-render via `innerHTML = ""`) is error-prone

## Decision

Replace DOM manipulation with Preact (function components + Hooks).

- **Preact over React**: 3KB gzipped; minimal impact on extension bundle size
- **Function components + Hooks**: Aligns with the domain layer's pure-function approach (FDM)
- **`class` attribute**: Preact natively supports `class` (no `className` needed), keeping JSX close to HTML
- **Shared components**: popup and app use the same `VocabApp` component; CSS differentiates layout via body class

### Component Structure

- `VocabApp` — State management (useState/useEffect) + storage interaction
- `VocabList` — Declarative rendering of sorted vocab entries or empty state
- `WordItem` — Single word display with pluck count and remove button
- `PluckDetail` — Single pluck history entry
- `OptionsApp` — Options page state management + UI

## Consequences

### Positive

- Declarative UI: data drives rendering automatically
- Component composition enables reuse (popup/app share VocabApp)
- Hooks (useState, useEffect) provide clear state lifecycle
- Tiny runtime overhead (3KB gzipped)

### Negative

- Added runtime dependency (preact)
- JSX/TSX requires build tooling support (jsxImportSource in tsconfig)
