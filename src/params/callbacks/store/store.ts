export class ParamsStore {
  private entries: { [key: string]: string | undefined } = {};

  keys(): string[] {
    return Object.keys(this.entries);
  }

  get(key: string): string | undefined {
    return this.entries[key];
  }

  set(key: string, value: string | undefined): void {
    this.entries[key] = value;
  }
}
