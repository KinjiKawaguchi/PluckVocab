import { useRef, useState } from "preact/hooks";
import type { Result } from "../../../domain/index.js";

type Props = {
  readonly onExport: () => Promise<Result<void, string>>;
  readonly onImport: (file: File) => Promise<Result<void, string>>;
};

export const DataSection = ({ onExport, onImport }: Props) => {
  const [status, setStatus] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showStatus = (message: string) => {
    setStatus(message);
    setTimeout(() => setStatus(""), 3000);
  };

  const handleExport = async () => {
    const result = await onExport();
    showStatus(result._tag === "ok" ? "Exported." : result.error);
  };

  const handleImport = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const result = await onImport(file);
    showStatus(result._tag === "ok" ? "Imported." : result.error);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <section>
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
      <p id="data-status">{status}</p>
    </section>
  );
};
