import { describe, expect, test } from "bun:test";
import {
  createPluckedAt,
  createSourceTitle,
  createSourceUrl,
  Pluck,
  Source,
  Vocab,
  type Word,
} from "../../src/domain/index.js";

const word = (s: string) => s as Word;
const pluck = (at: number, url: string, title: string) =>
  new Pluck(createPluckedAt(at), new Source(createSourceUrl(url), createSourceTitle(title)));

describe("Vocab.merge", () => {
  test("empty merged with empty produces empty", () => {
    const result = Vocab.empty().merge(Vocab.empty());
    expect(result.isEmpty).toBe(true);
  });

  test("empty merged with non-empty produces non-empty content", () => {
    const other = Vocab.empty().add(word("hello"), pluck(1, "https://example.com", "Example"));
    const result = Vocab.empty().merge(other);
    expect(result.size).toBe(1);
    const entries = [...result];
    expect(entries[0][0] as string).toBe("hello");
  });

  test("non-empty merged with empty remains unchanged", () => {
    const base = Vocab.empty().add(word("hello"), pluck(1, "https://example.com", "Example"));
    const result = base.merge(Vocab.empty());
    expect(result.size).toBe(1);
    const entries = [...result];
    expect(entries[0][0] as string).toBe("hello");
  });

  test("merge with overlapping word combines plucks", () => {
    const base = Vocab.empty().add(word("hello"), pluck(1, "https://a.com", "A"));
    const other = Vocab.empty().add(word("hello"), pluck(2, "https://b.com", "B"));
    const result = base.merge(other);
    expect(result.size).toBe(1);
    const entries = [...result];
    expect(entries[0][1]).toHaveLength(2);
  });

  test("merge with different words includes all", () => {
    const base = Vocab.empty().add(word("hello"), pluck(1, "https://a.com", "A"));
    const other = Vocab.empty().add(word("world"), pluck(2, "https://b.com", "B"));
    const result = base.merge(other);
    expect(result.size).toBe(2);
  });
});
