import { useState } from "preact/hooks";
import type { Vocab, Word } from "../../../domain/index.js";

type VocabActions = {
  readonly vocab: Vocab;
  readonly remove: (word: Word) => void;
};

export const useVocabActions = (
  initialVocab: Vocab,
  persist: (vocab: Vocab) => void,
): VocabActions => {
  const [vocab, setVocab] = useState(initialVocab);

  const remove = (word: Word) => {
    const next = vocab.remove(word);
    setVocab(next);
    persist(next);
  };

  return { vocab, remove };
};
