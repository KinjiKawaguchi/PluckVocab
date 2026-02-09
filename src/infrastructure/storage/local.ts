import { err, ok, type StoragePort, Vocab } from "../../domain/index.js";
import { deserializeVocab, type SerializedEntry, serializeVocab } from "../serialization.js";

const STORAGE_KEY = "pluckvocab_vocab";

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
