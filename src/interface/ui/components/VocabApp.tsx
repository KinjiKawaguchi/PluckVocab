import { useEffect, useState } from "preact/hooks";
import { isOk, type StoragePort, Vocab, type Word } from "../../../domain/index.js";
import { createStorage } from "../../../infrastructure/storage/index.js";
import { VocabList } from "./VocabList.js";

export const VocabApp = () => {
  const [vocab, setVocab] = useState(Vocab.empty());
  const [storage, setStorage] = useState<StoragePort | null>(null);

  useEffect(() => {
    const init = async () => {
      const s = await createStorage();
      setStorage(s);
      const result = await s.load();
      if (isOk(result)) {
        setVocab(result.value);
      }
    };
    init();
  }, []);

  const handleRemove = async (word: Word) => {
    const next = vocab.remove(word);
    setVocab(next);
    if (storage) {
      await storage.save(next);
    }
  };

  return <VocabList vocab={vocab} onRemove={handleRemove} />;
};
