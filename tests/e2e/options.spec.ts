import { resolve } from "node:path";
import { expect, test } from "./fixtures.js";

test("options page shows select and Save button", async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/options.html`);

  await expect(page.locator("select#storage-backend")).toBeVisible();
  await expect(page.getByRole("button", { name: "Save" })).toBeVisible();
});

test("Save button shows 'Saved.' message", async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/options.html`);

  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.locator("#status")).toHaveText("Saved.");
});

test("import JSON file adds words to vocabulary", async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/options.html`);

  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Import" }).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(resolve(import.meta.dirname, "fixtures/import-sample.json"));

  await expect(page.locator("#data-status")).toHaveText("Imported.");

  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(page.locator(".vocab-word").first()).toHaveText("vocabulary");
});
