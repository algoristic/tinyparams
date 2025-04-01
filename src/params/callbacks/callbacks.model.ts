import { ParamsSnapshot } from '../params.model';
import { ParamsStore } from './store/store';

export type ParamChangeFn = (
  newValue: string | undefined,
  oldValue: string | undefined,
) => void;
export type ParamValueFn = (value: string | undefined) => void;
export type ParamsValueFn = (snapshot: ParamsSnapshot) => void;
export type ParamCallbackFn = ParamChangeFn | ParamValueFn | ParamsValueFn;

export class CallbackRegistry<T extends ParamCallbackFn> {
  private readonly callbacks: Record<string, T[]> = {};

  register(key: string, callback: T): void {
    this.callbacks[key] = [...(this.callbacks[key] ?? []), callback];
  }

  entries(key: string): T[] {
    return this.callbacks[key] ?? [];
  }
}
