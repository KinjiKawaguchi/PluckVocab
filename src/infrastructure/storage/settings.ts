const BACKEND_KEY = "pluckvocab_storage_backend";
const DEFAULT_BACKEND = "local";

export const loadBackendSetting = async (): Promise<string> => {
  const result = await chrome.storage.local.get(BACKEND_KEY);
  return (result[BACKEND_KEY] as string) ?? DEFAULT_BACKEND;
};

export const saveBackendSetting = async (backend: string): Promise<void> => {
  await chrome.storage.local.set({ [BACKEND_KEY]: backend });
};
