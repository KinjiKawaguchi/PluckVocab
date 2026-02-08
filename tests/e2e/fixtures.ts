import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  type BrowserContext,
  type Page,
  type Worker,
  test as base,
  chromium,
} from "@playwright/test";

const DIST_PATH = resolve(dirname(fileURLToPath(import.meta.url)), "../../dist");

type WorkerFixtures = {
  extensionContext: BrowserContext;
  extensionId: string;
  serviceWorker: Worker;
};

type TestFixtures = {
  page: Page;
};

export const test = base.extend<TestFixtures, WorkerFixtures>({
  extensionContext: [
    // biome-ignore lint/correctness/noEmptyPattern: Playwright fixture signature requires destructuring
    async ({}, use) => {
      const context = await chromium.launchPersistentContext("", {
        headless: false,
        args: [`--disable-extensions-except=${DIST_PATH}`, `--load-extension=${DIST_PATH}`],
      });
      await use(context);
      await context.close();
    },
    { scope: "worker" },
  ],

  extensionId: [
    async ({ serviceWorker }, use) => {
      const id = serviceWorker.url().split("/")[2];
      await use(id);
    },
    { scope: "worker" },
  ],

  serviceWorker: [
    async ({ extensionContext }, use) => {
      let [sw] = extensionContext.serviceWorkers();
      if (!sw) {
        sw = await extensionContext.waitForEvent("serviceworker");
      }
      await use(sw);
    },
    { scope: "worker" },
  ],

  page: async ({ extensionContext, extensionId }, use) => {
    const page = await extensionContext.newPage();
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
    await page.evaluate(() => chrome.storage.local.clear());
    await use(page);
    await page.close();
  },
});

export const expect = test.expect;
