import {
  createPluckedAt,
  createSourceTitle,
  createSourceUrl,
  Pluck,
  Source,
  Vocab,
  type Word,
} from "../domain/index.js";

export type SerializedPluck = { at: number; source: { url: string; title: string } };
export type SerializedEntry = { word: string; plucks: SerializedPluck[] };

export const serializeVocab = (vocab: Vocab): SerializedEntry[] =>
  [...vocab].map(([word, plucks]) => ({
    word: word as string,
    plucks: plucks.map((p) => ({
      at: p.at as number,
      source: { url: p.source.url as string, title: p.source.title as string },
    })),
  }));

export const deserializeVocab = (entries: SerializedEntry[]): Vocab =>
  Vocab.fromEntries(
    entries.map((entry) => [
      entry.word as Word,
      entry.plucks.map(
        (p) =>
          new Pluck(
            createPluckedAt(p.at),
            new Source(createSourceUrl(p.source.url), createSourceTitle(p.source.title)),
          ),
      ),
    ]),
  );
