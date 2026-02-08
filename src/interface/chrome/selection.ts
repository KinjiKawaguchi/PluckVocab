export const getSelectionFromTab = async (tabId: number): Promise<string> => {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => window.getSelection()?.toString().trim() ?? "",
  });
  return results[0]?.result ?? "";
};
