import type { StoragePort } from "../../domain/index.js";
import { createLocalStorage } from "./local.js";

const BACKEND_KEY = "pluckvocab_storage_backend";

export const createStorage = async (): Promise<StoragePort> => {
  const result = await chrome.storage.local.get(BACKEND_KEY);
  const backendType = result[BACKEND_KEY] as string | undefined;

  switch (backendType) {
    case "local":
      return createLocalStorage();
    default:
      return createLocalStorage();
  }
};
