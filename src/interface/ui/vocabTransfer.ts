import {
  createPluckedAt,
  createSourceTitle,
  createSourceUrl,
  Pluck,
  Source,
  type Vocab,
  type Word,
} from "../../domain/index.js";

type SerializedPluck = { at: number; source: { url: string; title: string } };
type SerializedEntry = { word: string; plucks: SerializedPluck[] };

const serializeVocab = (vocab: Vocab): SerializedEntry[] =>
  [...vocab].map(([word, plucks]) => ({
    word: word as string,
    plucks: plucks.map((p) => ({
      at: p.at as number,
      source: { url: p.source.url as string, title: p.source.title as string },
    })),
  }));

const readJsonFile = (file: File): Promise<SerializedEntry[]> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result as string));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });

const mergeEntries = (current: Vocab, entries: SerializedEntry[]): Vocab => {
  let vocab = current;
  for (const entry of entries) {
    const word = entry.word as Word;
    for (const p of entry.plucks) {
      const pluck = new Pluck(
        createPluckedAt(p.at),
        new Source(createSourceUrl(p.source.url), createSourceTitle(p.source.title)),
      );
      vocab = vocab.add(word, pluck);
    }
  }
  return vocab;
};

export const exportVocab = (vocab: Vocab): void => {
  const data = serializeVocab(vocab);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "pluckvocab-export.json";
  a.click();
  URL.revokeObjectURL(url);
};

export const importVocab = async (current: Vocab, file: File): Promise<Vocab> => {
  const entries = await readJsonFile(file);
  return mergeEntries(current, entries);
};
