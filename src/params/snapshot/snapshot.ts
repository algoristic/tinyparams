import { ParamSnapshot, ParamsSnapshot } from './snapshot.model';

export function createSnapshot(searchParams: URLSearchParams): ParamsSnapshot {
  const entries = Array.from(searchParams.entries());
  const snapshot: ParamsSnapshot = {
    keys(): string[] {
      return entries.map(([key]) => key);
    },
    get(key: string): string | undefined {
      return entries
        .filter(([entryKey]) => entryKey === key)
        .map(([, value]) => value)
        .pop();
    },
    entries(): ParamSnapshot[] {
      return entries.map(([key, value]) => ({ key, value }));
    },
  };
  return snapshot;
}
