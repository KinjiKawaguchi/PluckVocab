import type { Vocab } from "../../../domain/index.js";
import { useVocabActions } from "../hooks/useVocabActions.js";
import { VocabList } from "./VocabList.js";

type Props = {
  readonly initialVocab: Vocab;
  readonly persist: (vocab: Vocab) => void;
};

export const VocabApp = ({ initialVocab, persist }: Props) => {
  const { vocab, remove } = useVocabActions(initialVocab, persist);
  return <VocabList vocab={vocab} onRemove={remove} />;
};
