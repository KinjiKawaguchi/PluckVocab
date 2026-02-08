import { expect, test } from "./fixtures.js";

test("options page shows select and Save button", async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/options.html`);

  await expect(page.locator("select#storage-backend")).toBeVisible();
  await expect(page.locator("section").getByRole("button", { name: "Save" })).toBeVisible();
});

test("Save button shows 'Saved.' message", async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/options.html`);

  await page.locator("section").getByRole("button", { name: "Save" }).click();
  await expect(page.locator("section #status")).toHaveText("Saved.");
});
