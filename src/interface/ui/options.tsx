import { render } from "preact";
import { isOk } from "../../domain/index.js";
import { createStorage } from "../../infrastructure/storage/index.js";
import {
  deserializeVocab,
  type SerializedEntry,
  serializeVocab,
} from "../../infrastructure/storage/serialization.js";
import { loadBackendSetting, saveBackendSetting } from "../../infrastructure/storage/settings.js";
import { OptionsApp } from "./components/OptionsApp.js";
import { downloadAsJson, readFileAsJson } from "./fileIO.js";

const main = async () => {
  const container = document.querySelector("main");
  if (!container) return;

  const [initialBackend, storage] = await Promise.all([loadBackendSetting(), createStorage()]);

  const handleExport = async (): Promise<string> => {
    const result = await storage.load();
    if (!isOk(result)) return "Failed to load vocabulary.";
    downloadAsJson(serializeVocab(result.value), "pluckvocab-export.json");
    return "Exported.";
  };

  const handleImport = async (file: File): Promise<string> => {
    try {
      const loadResult = await storage.load();
      if (!isOk(loadResult)) return "Failed to load current vocabulary.";
      const imported = deserializeVocab(await readFileAsJson<SerializedEntry[]>(file));
      const merged = loadResult.value.merge(imported);
      const saveResult = await storage.save(merged);
      if (!isOk(saveResult)) return "Failed to save vocabulary.";
      return "Imported.";
    } catch {
      return "Invalid file.";
    }
  };

  render(
    <OptionsApp
      initialBackend={initialBackend}
      onSave={saveBackendSetting}
      onExport={handleExport}
      onImport={handleImport}
    />,
    container,
  );
};

main();
