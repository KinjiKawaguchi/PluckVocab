import { useEffect, useRef, useState } from "preact/hooks";

const BACKEND_KEY = "pluckvocab_storage_backend";

export const OptionsApp = () => {
  const [backend, setBackend] = useState("local");
  const [status, setStatus] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    chrome.storage.local.get(BACKEND_KEY).then((result) => {
      setBackend((result[BACKEND_KEY] as string) ?? "local");
    });
  }, []);

  const handleSave = async () => {
    await chrome.storage.local.set({ [BACKEND_KEY]: backend });
    setStatus("Saved.");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setStatus(""), 2000);
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
