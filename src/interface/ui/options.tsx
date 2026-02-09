import { render } from "preact";
import { loadBackendSetting, saveBackendSetting } from "../../infrastructure/storage/settings.js";
import { OptionsApp } from "./components/OptionsApp.js";

const main = async () => {
  const container = document.querySelector("main");
  if (!container) return;

  const initialBackend = await loadBackendSetting();

  render(<OptionsApp initialBackend={initialBackend} onSave={saveBackendSetting} />, container);
};

main();
