export function getParameterValue(
  key: string,
  searchParams: URLSearchParams,
): string | undefined {
  return searchParams.get(key) ?? undefined;
}

export function setParameterValue(
  key: string,
  value: any,
  searchParams: URLSearchParams,
): URLSearchParams {
  let paramValue: string | undefined = undefined;
  if (!value && typeof value !== 'boolean') {
    searchParams.delete(key);
  } else {
    paramValue = new String(value).toString();
    searchParams.set(key, paramValue);
  }
  return searchParams;
}

export function getSearchParams(
  useHash: boolean,
  url: string,
): URLSearchParams {
  if (useHash) {
    return getHashLocationSearchParams(url);
  } else {
    return getStandardSearchParams(url);
  }
}

function getHashLocationSearchParams(url: string): URLSearchParams {
  const hashString = url.split('#')[1] ?? '';
  const queryString = hashString.split('?')[1] ?? '';
  return new URLSearchParams(queryString);
}

function getStandardSearchParams(url: string): URLSearchParams {
  let queryString = url.split('?')[1] ?? '';
  queryString = queryString.split('#')[0];
  return new URLSearchParams(queryString);
}
