import type { Pluck, Word } from "../../../domain/index.js";
import { PluckDetail } from "./PluckDetail.js";

type Props = {
  readonly word: Word;
  readonly plucks: ReadonlyArray<Pluck>;
  readonly onRemove: (word: Word) => void;
};

export const WordItem = ({ word, plucks, onRemove }: Props) => (
  <article class="vocab-item">
    <div class="vocab-item-header">
      <span class="vocab-word">{word as string}</span>
      <span class="pluck-count">{plucks.length}x</span>
      <button type="button" class="remove-btn" onClick={() => onRemove(word)}>
        {"\u00d7"}
      </button>
    </div>
    <ul class="pluck-details">
      {plucks.map((pluck) => (
        <PluckDetail key={`${pluck.at}-${pluck.source.url}`} pluck={pluck} />
      ))}
    </ul>
  </article>
);
