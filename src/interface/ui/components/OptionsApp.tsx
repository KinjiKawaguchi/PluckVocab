import { useRef, useState } from "preact/hooks";
import type { StoragePort } from "../../../domain/index.js";
import { isOk } from "../../../domain/index.js";
import { exportVocab, importVocab } from "../vocabTransfer.js";

type Props = {
  readonly initialBackend: string;
  readonly onSave: (backend: string) => Promise<void>;
  readonly storage: StoragePort;
};

export const OptionsApp = ({ initialBackend, onSave, storage }: Props) => {
  const [backend, setBackend] = useState(initialBackend);
  const [status, setStatus] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showStatus = (message: string) => {
    setStatus(message);
    setTimeout(() => setStatus(""), 3000);
  };

  const handleSave = async () => {
    await onSave(backend);
    showStatus("Saved.");
  };

  const handleExport = async () => {
    const result = await storage.load();
    if (!isOk(result)) {
      showStatus("Failed to load vocabulary.");
      return;
    }
    exportVocab(result.value);
    showStatus("Exported.");
  };

  const handleImport = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    try {
      const result = await storage.load();
      if (!isOk(result)) {
        showStatus("Failed to load current vocabulary.");
        return;
      }
      const merged = await importVocab(result.value, file);
      const saveResult = await storage.save(merged);
      if (!isOk(saveResult)) {
        showStatus("Failed to save vocabulary.");
        return;
      }
      showStatus("Imported.");
    } catch {
      showStatus("Invalid file.");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <section>
        <label for="storage-backend">Storage Backend</label>
        <select
          id="storage-backend"
          value={backend}
          onChange={(e) => setBackend((e.target as HTMLSelectElement).value)}
        >
          <option value="local">Local Storage</option>
        </select>
        <button type="button" onClick={handleSave}>
          Save
        </button>
        <p id="status">{status}</p>
      </section>
      <section class="data-section">
        <h2>Data</h2>
        <div class="data-actions">
          <button type="button" onClick={handleExport}>
            Export
          </button>
          <button type="button" onClick={() => fileInputRef.current?.click()}>
            Import
          </button>
          <input ref={fileInputRef} type="file" accept=".json" hidden onChange={handleImport} />
        </div>
      </section>
    </>
  );
};
