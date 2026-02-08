import { type Result, err, ok } from "./result.js";

// === Branded Types ===

declare const WordBrand: unique symbol;
export type Word = string & { readonly [WordBrand]: typeof WordBrand };

declare const PluckedAtBrand: unique symbol;
export type PluckedAt = number & { readonly [PluckedAtBrand]: typeof PluckedAtBrand };

declare const SourceUrlBrand: unique symbol;
export type SourceUrl = string & { readonly [SourceUrlBrand]: typeof SourceUrlBrand };

declare const SourceTitleBrand: unique symbol;
export type SourceTitle = string & { readonly [SourceTitleBrand]: typeof SourceTitleBrand };

// === Value Objects ===

export class Source {
  readonly url: SourceUrl;
  readonly title: SourceTitle;

  constructor(url: SourceUrl, title: SourceTitle) {
    this.url = url;
    this.title = title;
  }
}

// === Domain Event ===
// Pluck: the act of selecting and saving a word from a page.
// Each Pluck records when and where it happened.

export class Pluck {
  readonly at: PluckedAt;
  readonly source: Source;

  constructor(at: PluckedAt, source: Source) {
    this.at = at;
    this.source = source;
  }
}

// === Aggregate Root ===
// Vocab (語彙) = collection of words (語の集まり).
// Immutable: every mutation returns a new instance.

export class Vocab {
  private constructor(private readonly entries: ReadonlyMap<Word, ReadonlyArray<Pluck>>) {}

  static empty(): Vocab {
    return new Vocab(new Map());
  }

  static fromEntries(entries: Iterable<[Word, ReadonlyArray<Pluck>]>): Vocab {
    return new Vocab(new Map(entries));
  }

  add(word: Word, pluck: Pluck): Vocab {
    const existing = this.entries.get(word) ?? [];
    return new Vocab(new Map([...this.entries, [word, [...existing, pluck]]]));
  }

  remove(word: Word): Vocab {
    const next = new Map(this.entries);
    next.delete(word);
    return new Vocab(next);
  }

  get size(): number {
    return this.entries.size;
  }

  get isEmpty(): boolean {
    return this.entries.size === 0;
  }

  toSorted(): ReadonlyArray<[Word, ReadonlyArray<Pluck>]> {
    return [...this.entries.entries()].sort(
      ([, a], [, b]) => Math.max(...b.map((p) => p.at)) - Math.max(...a.map((p) => p.at)),
    );
  }

  [Symbol.iterator](): IterableIterator<[Word, ReadonlyArray<Pluck>]> {
    return this.entries[Symbol.iterator]();
  }
}

// === Domain Errors ===

export type PluckError = "empty-selection";

// === Smart Constructors ===

export const createWord = (raw: string): Result<Word, PluckError> => {
  const normalized = raw.trim().toLowerCase();
  if (normalized === "") return err("empty-selection");
  return ok(normalized as Word);
};

export const createPluckedAt = (epochMs: number): PluckedAt => epochMs as PluckedAt;

export const createSourceUrl = (raw: string): SourceUrl => raw as SourceUrl;

export const createSourceTitle = (raw: string): SourceTitle => raw as SourceTitle;
