import { useState } from "preact/hooks";

type Props = {
  readonly initialBackend: string;
  readonly onSave: (backend: string) => Promise<void>;
};

export const SettingsSection = ({ initialBackend, onSave }: Props) => {
  const [backend, setBackend] = useState(initialBackend);
  const [status, setStatus] = useState("");

  const handleSave = async () => {
    await onSave(backend);
    setStatus("Saved.");
    setTimeout(() => setStatus(""), 3000);
  };

  return (
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
  );
};
