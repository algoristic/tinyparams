import { UrlUpdateMode } from './url.model';

export function createUpdatedUrlString(
  searchParams: URLSearchParams,
  useHash: boolean,
): string {
  if (useHash) {
    return createHashLocationSearchString(searchParams);
  } else {
    return createStandardUrlString(searchParams);
  }
}

export function updateUrl(
  urlString: string,
  urlUpdateMode: UrlUpdateMode = 'push',
): void {
  const updateFn =
    urlUpdateMode === 'replace'
      ? window.history.replaceState
      : window.history.pushState;
  updateFn.apply(window.history, [null, '', urlString]);
}

function createHashLocationSearchString(searchParams: URLSearchParams): string {
  const [path] = window.location.hash.split('?');
  const newUrlString =
    '/' +
    (path.startsWith('#') ? path : '#'.concat(path)) +
    '?' +
    searchParams.toString();
  return newUrlString;
}

function createStandardUrlString(searchParams: URLSearchParams): string {
  const newUrlString =
    window.location.pathname +
    '?' +
    searchParams.toString() +
    window.location.hash;
  return newUrlString;
}
