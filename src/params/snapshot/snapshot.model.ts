export interface ParamSnapshot {
  key: string;
  value: string;
}

export interface ParamsSnapshot {
  keys(): string[];
  get(key: string): string | undefined;
  entries(): ParamSnapshot[];
}
