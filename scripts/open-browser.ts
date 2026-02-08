import path from "node:path";
import { chromium } from "playwright";

const DIST_PATH = path.resolve(import.meta.dir, "../dist");
const USER_DATA = path.resolve(import.meta.dir, "../.browser-profile");

const context = await chromium.launchPersistentContext(USER_DATA, {
  headless: false,
  args: [`--disable-extensions-except=${DIST_PATH}`, `--load-extension=${DIST_PATH}`],
});

const page = context.pages()[0] ?? (await context.newPage());
await page.goto("https://en.wikipedia.org/wiki/Vocabulary");

console.log("Browser opened with PluckVocab loaded.");
console.log("Press Ctrl+C to close.");

await new Promise(() => {});
