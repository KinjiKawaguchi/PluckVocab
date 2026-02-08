import { render } from "preact";
import { createStorage } from "../../infrastructure/storage/index.js";
import { loadBackendSetting, saveBackendSetting } from "../../infrastructure/storage/settings.js";
import { OptionsApp } from "./components/OptionsApp.js";

const main = async () => {
  const container = document.querySelector("main");
  if (!container) return;

  const [initialBackend, storage] = await Promise.all([loadBackendSetting(), createStorage()]);

  render(
    <OptionsApp initialBackend={initialBackend} onSave={saveBackendSetting} storage={storage} />,
    container,
  );
};

main();
