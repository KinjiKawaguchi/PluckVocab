import { render } from "preact";
import { VocabApp } from "./components/VocabApp.js";

const container = document.getElementById("vocab-container");
if (container) {
  render(<VocabApp />, container);
}
