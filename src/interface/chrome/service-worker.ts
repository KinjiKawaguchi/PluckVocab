import {
  createPluckedAt,
  createSourceTitle,
  createSourceUrl,
  createWord,
  flatMapAsync,
  map,
  Pluck,
  type PluckError,
  type Result,
  Source,
  type StorageError,
} from "../../domain/index.js";
import { createStorage } from "../../infrastructure/storage/index.js";
import { getSelectionFromTab } from "./selection.js";

const CONTEXT_MENU_ID = "pluckvocab-pluck";

async function pluckWord(
  text: string,
  url: string,
  title: string,
): Promise<Result<void, PluckError | StorageError>> {
  const source = new Source(createSourceUrl(url), createSourceTitle(title));
  const pluck = new Pluck(createPluckedAt(Date.now()), source);
  const storage = await createStorage();

  return flatMapAsync(createWord(text), async (word) =>
    map(await storage.load(), (vocab) => {
      storage.save(vocab.add(word, pluck));
    }),
  );
}

// Expose for E2E testing via serviceWorker.evaluate()
Object.assign(self, { pluckWord });

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: 'Pluck "%s"',
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== CONTEXT_MENU_ID) return;

  let selectionText = info.selectionText?.trim() ?? "";
  if (!selectionText && tab?.id) {
    selectionText = await getSelectionFromTab(tab.id);
  }

  await pluckWord(selectionText, info.pageUrl ?? tab?.url ?? "", tab?.title ?? "");
});
