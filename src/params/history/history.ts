const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

function dispatchLocationChangeEvent(url: string | URL | null | undefined) {
  window.dispatchEvent(new CustomEvent('locationchange', { detail: { url } }));
}

export const extendedPushState = function (
  ...args: Parameters<typeof originalPushState>
) {
  const [, , url] = args;
  originalPushState.apply(history, args);
  dispatchLocationChangeEvent(url);
};

export const extendedReplaceState = function (
  ...args: Parameters<typeof originalReplaceState>
) {
  const [, , url] = args;
  originalReplaceState.apply(history, args);
  dispatchLocationChangeEvent(url);
};

window.addEventListener('popstate', () => {
  dispatchLocationChangeEvent(window.location.href);
});
