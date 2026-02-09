import { render } from "preact";
import { isOk, Vocab } from "../../domain/index.js";
import { createStorage } from "../../infrastructure/storage/index.js";
import { VocabApp } from "./components/VocabApp.js";

export const initVocabApp = async (container: Element) => {
  const storage = await createStorage();
  const result = await storage.load();
  const initialVocab = isOk(result) ? result.value : Vocab.empty();

  render(
    <VocabApp
      initialVocab={initialVocab}
      persist={(v) => {
        storage.save(v);
      }}
    />,
    container,
  );
};
