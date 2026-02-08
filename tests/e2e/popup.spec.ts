import { expect, test } from "./fixtures.js";

const STORAGE_KEY = "pluckvocab_vocab";

const testVocab = [
  {
    word: "hello",
    plucks: [{ at: 1000, source: { url: "https://example.com", title: "Example" } }],
  },
  {
    word: "world",
    plucks: [{ at: 2000, source: { url: "https://example.com/2", title: "Example 2" } }],
  },
];

test("popup shows empty state when no words exist", async ({ page }) => {
  await page.reload();
  await expect(page.locator(".empty-state")).toHaveText(/No words plucked yet/);
});

test("popup displays words from storage", async ({ page }) => {
  await page.evaluate(({ key, data }) => chrome.storage.local.set({ [key]: data }), {
    key: STORAGE_KEY,
    data: testVocab,
  });
  await page.reload();

  await expect(page.locator(".vocab-word").first()).toBeVisible();
  const words = await page.locator(".vocab-word").allTextContents();
  expect(words).toContain("hello");
  expect(words).toContain("world");
});

test("delete a word and verify persistence after reload", async ({ page }) => {
  await page.evaluate(({ key, data }) => chrome.storage.local.set({ [key]: data }), {
    key: STORAGE_KEY,
    data: testVocab,
  });
  await page.reload();

  await expect(page.locator(".vocab-word").first()).toBeVisible();
  const countBefore = await page.locator(".vocab-item").count();

  await page.locator(".remove-btn").first().click();
  await expect(page.locator(".vocab-item")).toHaveCount(countBefore - 1);

  await page.reload();
  await expect(page.locator(".vocab-item")).toHaveCount(countBefore - 1);
});

test("pluck via service worker normalizes word to lowercase", async ({ page, serviceWorker }) => {
  // Call pluckWord directly in the service worker (simulates context menu click)
  await serviceWorker.evaluate(async () => {
    const { pluckWord } = self as unknown as {
      pluckWord: (text: string, url: string, title: string) => Promise<unknown>;
    };
    await pluckWord("JavaScript", "https://example.com/test", "Test Page");
  });

  await page.reload();
  await expect(page.locator(".vocab-word").first()).toBeVisible();

  const words = await page.locator(".vocab-word").allTextContents();
  expect(words).toContain("javascript"); // normalized to lowercase
  expect(words).not.toContain("JavaScript");
});

test("popup displays lowercase-normalized words correctly", async ({ page }) => {
  // createWord normalizes to lowercase; verify UI displays correctly
  const lowerCaseData = [
    {
      word: "example", // lowercase as createWord would produce
      plucks: [{ at: Date.now(), source: { url: "https://example.com", title: "Example Domain" } }],
    },
    {
      word: "javascript", // another lowercase word
      plucks: [{ at: Date.now() + 1, source: { url: "https://example.com", title: "Test" } }],
    },
  ];

  await page.evaluate(({ key, data }) => chrome.storage.local.set({ [key]: data }), {
    key: STORAGE_KEY,
    data: lowerCaseData,
  });
  await page.reload();

  await expect(page.locator(".vocab-word").first()).toBeVisible();
  const words = await page.locator(".vocab-word").allTextContents();
  expect(words).toContain("example");
  expect(words).toContain("javascript");
  // Verify no uppercase versions exist
  expect(words).not.toContain("Example");
  expect(words).not.toContain("JavaScript");
});
