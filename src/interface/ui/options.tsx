import { render } from "preact";
import { err, isOk, ok, type Result } from "../../domain/index.js";
import {
  deserializeVocab,
  type SerializedEntry,
  serializeVocab,
} from "../../infrastructure/serialization.js";
import { createStorage } from "../../infrastructure/storage/index.js";
import { loadBackendSetting, saveBackendSetting } from "../../infrastructure/storage/settings.js";
import { OptionsApp } from "./components/OptionsApp.js";

const downloadAsJson = (data: unknown, filename: string): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const readFileAsJson = <T,>(file: File): Promise<T> =>
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

const main = async () => {
  const container = document.querySelector("main");
  if (!container) return;

  const [initialBackend, storage] = await Promise.all([loadBackendSetting(), createStorage()]);

  const handleExport = async (): Promise<Result<void, string>> => {
    const result = await storage.load();
    if (!isOk(result)) return err("Failed to load vocabulary.");
    downloadAsJson(serializeVocab(result.value), "pluckvocab-export.json");
    return ok(undefined);
  };

  const handleImport = async (file: File): Promise<Result<void, string>> => {
    try {
      const loadResult = await storage.load();
      if (!isOk(loadResult)) return err("Failed to load current vocabulary.");
      const imported = deserializeVocab(await readFileAsJson<SerializedEntry[]>(file));
      const merged = loadResult.value.merge(imported);
      const saveResult = await storage.save(merged);
      if (!isOk(saveResult)) return err("Failed to save vocabulary.");
      return ok(undefined);
    } catch {
      return err("Invalid file.");
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
