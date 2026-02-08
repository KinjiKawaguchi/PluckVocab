import { render } from "preact";
import { OptionsApp } from "./components/OptionsApp.js";

const container = document.querySelector("main");
if (container) {
  render(<OptionsApp />, container);
}
