// Dark mode state is stored per hostname: { "dark:<hostname>": true }.

const keyFor = (url) => {
  try {
    const { protocol, hostname } = new URL(url);
    return protocol.startsWith("http") && hostname ? `dark:${hostname}` : null;
  } catch {
    return null;
  }
};

async function isDark(url) {
  const key = keyFor(url);
  if (!key) return false;
  return Boolean((await browser.storage.local.get(key))[key]);
}

async function refreshButton(tab) {
  if (!tab || tab.id === undefined) return;
  const on = await isDark(tab.url);
  const state = on ? "on" : "off";
  await browser.action.setIcon({
    tabId: tab.id,
    path: { 16: `icons/${state}-16.png`, 32: `icons/${state}-32.png` },
  });
  await browser.action.setTitle({
    tabId: tab.id,
    title: on ? "Turn off dark mode" : "Turn on dark mode",
  });
}

browser.action.onClicked.addListener(async (tab) => {
  const key = keyFor(tab.url);
  if (!key) return; // Not a normal web page.
  const on = !(await isDark(tab.url));
  if (on) {
    await browser.storage.local.set({ [key]: true });
  } else {
    await browser.storage.local.remove(key);
  }
  // Content scripts listen to storage changes, so every open tab of this
  // site flips at once. Refresh the toolbar button for all of them too.
  const tabs = await browser.tabs.query({});
  await Promise.all(tabs.filter((t) => keyFor(t.url) === key).map(refreshButton));
});

browser.tabs.onActivated.addListener(async ({ tabId }) => {
  refreshButton(await browser.tabs.get(tabId));
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url || changeInfo.status === "loading") refreshButton(tab);
});
