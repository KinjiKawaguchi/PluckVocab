import type { Vocab, Word } from "../../../domain/index.js";
import { WordItem } from "./WordItem.js";

type Props = {
  readonly vocab: Vocab;
  readonly onRemove: (word: Word) => void;
};

export const VocabList = ({ vocab, onRemove }: Props) => {
  if (vocab.isEmpty) {
    return (
      <p class="empty-state">
        No words plucked yet. Select text on any page and right-click to pluck.
      </p>
    );
  }

  return (
    <>
      {vocab.toSorted().map(([word, plucks]) => (
        <WordItem key={word as string} word={word} plucks={plucks} onRemove={onRemove} />
      ))}
    </>
  );
};
