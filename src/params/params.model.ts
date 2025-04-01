import {
  ParamChangeFn,
  ParamsValueFn,
  ParamValueFn,
} from './callbacks/callbacks.model';
import { ParamsSnapshot } from './snapshot/snapshot.model';
import { UrlUpdateMode } from './url/url.model';

export {
  ParamCallbackFn,
  ParamChangeFn,
  ParamsValueFn,
  ParamValueFn,
} from './callbacks/callbacks.model';
export { ParamsSnapshot, ParamSnapshot } from './snapshot/snapshot.model';
export { UrlUpdateMode } from './url/url.model';

export interface ParamUpdateOptions {
  updateMode?: UrlUpdateMode;
}

export interface Param {
  getValue(): string | undefined;
  setValue(value: any, options?: ParamUpdateOptions): void;
  remove(): void;
  watch(callback: ParamValueFn): void;
  onChange(callback: ParamChangeFn): void;
}

export interface ParamsFn {
  (key: string): Param;
  useHash: boolean;
  snapshot(): ParamsSnapshot;
  watch(callback: ParamsValueFn): void;
  modifiers(): ParamModifiers;
}

export interface ParamModifiers {
  setOne(key: string, value: any, options?: ParamUpdateOptions): void;
  setMany(many: Record<string, any>, options?: ParamUpdateOptions): void;
  setAll(all: Record<string, any>, options?: ParamUpdateOptions): void;
}
