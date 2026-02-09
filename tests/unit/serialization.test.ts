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
import {
  deserializeVocab,
  serializeVocab,
} from "../../src/infrastructure/storage/serialization.js";

const word = (s: string) => s as Word;
const pluck = (at: number, url: string, title: string) =>
  new Pluck(createPluckedAt(at), new Source(createSourceUrl(url), createSourceTitle(title)));

describe("serialization roundtrip", () => {
  test("empty vocab survives roundtrip", () => {
    const original = Vocab.empty();
    const result = deserializeVocab(serializeVocab(original));
    expect(result.isEmpty).toBe(true);
  });

  test("vocab with entries survives roundtrip", () => {
    const original = Vocab.empty()
      .add(word("hello"), pluck(1000, "https://example.com", "Example"))
      .add(word("world"), pluck(2000, "https://other.com", "Other"));

    const serialized = serializeVocab(original);
    const restored = deserializeVocab(serialized);

    expect(restored.size).toBe(2);

    const originalEntries = [...original].sort(([a], [b]) =>
      (a as string).localeCompare(b as string),
    );
    const restoredEntries = [...restored].sort(([a], [b]) =>
      (a as string).localeCompare(b as string),
    );

    for (let i = 0; i < originalEntries.length; i++) {
      expect(restoredEntries[i][0] as string).toBe(originalEntries[i][0] as string);
      expect(restoredEntries[i][1]).toHaveLength(originalEntries[i][1].length);
      for (let j = 0; j < originalEntries[i][1].length; j++) {
        expect(restoredEntries[i][1][j].at).toBe(originalEntries[i][1][j].at);
        expect(restoredEntries[i][1][j].source.url).toBe(originalEntries[i][1][j].source.url);
        expect(restoredEntries[i][1][j].source.title).toBe(originalEntries[i][1][j].source.title);
      }
    }
  });

  test("deserialize empty array produces empty vocab", () => {
    const result = deserializeVocab([]);
    expect(result.isEmpty).toBe(true);
  });

  test("word with multiple plucks survives roundtrip", () => {
    const original = Vocab.empty()
      .add(word("hello"), pluck(1000, "https://a.com", "A"))
      .add(word("hello"), pluck(2000, "https://b.com", "B"));

    const restored = deserializeVocab(serializeVocab(original));
    const entries = [...restored];
    expect(entries).toHaveLength(1);
    expect(entries[0][1]).toHaveLength(2);
  });
});
