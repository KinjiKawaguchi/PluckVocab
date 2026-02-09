import type { StoragePort } from "../../domain/index.js";
import { createLocalStorage } from "./local.js";
import { loadBackendSetting } from "./settings.js";

export const createStorage = async (): Promise<StoragePort> => {
  const backendType = await loadBackendSetting();

  switch (backendType) {
    case "local":
      return createLocalStorage();
    default:
      return createLocalStorage();
  }
};
