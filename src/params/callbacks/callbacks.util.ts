type KeyArrayElement = { keys(): string[] };

export function areKeysMatching(
  element: KeyArrayElement,
  other: KeyArrayElement,
): boolean {
  let elementKeys = element.keys().slice();
  let otherKeys = other.keys().slice();

  if (elementKeys.length !== otherKeys.length) {
    return false;
  }

  elementKeys.sort();
  otherKeys.sort();

  return elementKeys.every((value, index) => value === otherKeys[index]);
}
