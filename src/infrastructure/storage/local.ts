import {
  createPluckedAt,
  createSourceTitle,
  createSourceUrl,
  err,
  ok,
  Pluck,
  Source,
  type StoragePort,
  Vocab,
  type Word,
} from "../../domain/index.js";

const STORAGE_KEY = "pluckvocab_vocab";

type SerializedPluck = { at: number; source: { url: string; title: string } };
type SerializedEntry = { word: string; plucks: SerializedPluck[] };

const serializeVocab = (vocab: Vocab): SerializedEntry[] =>
  [...vocab].map(([word, plucks]) => ({
    word: word as string,
    plucks: plucks.map((p) => ({
      at: p.at,
      source: { url: p.source.url, title: p.source.title },
    })),
  }));

const deserializeVocab = (entries: SerializedEntry[]): Vocab =>
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

export const createLocalStorage = (): StoragePort => ({
  load: async () => {
    try {
      const result = await chrome.storage.local.get(STORAGE_KEY);
      const raw = result[STORAGE_KEY];
      if (!raw) return ok(Vocab.empty());
      return ok(deserializeVocab(raw as SerializedEntry[]));
    } catch {
      return err("read-failed" as const);
    }
  },

  save: async (vocab: Vocab) => {
    try {
      await chrome.storage.local.set({ [STORAGE_KEY]: serializeVocab(vocab) });
      return ok(undefined);
    } catch {
      return err("write-failed" as const);
    }
  },
});
