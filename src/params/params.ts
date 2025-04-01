import {
  registerSnapshotCallback,
  registerValueCallback,
  registerValueChangeCallback,
} from './callbacks/callbacks';
import {
  ParamChangeFn,
  ParamsValueFn,
  ParamValueFn,
} from './callbacks/callbacks.model';
import {
  ParamsFn,
  ParamUpdateOptions,
  ParamsSnapshot,
  ParamModifiers,
} from './params.model';
import {
  getParameterValue,
  getSearchParams,
  setParameterValue,
} from './search-params/search-params';
import { createSnapshot } from './snapshot/snapshot';
import { createUpdatedUrlString, updateUrl } from './url/url';

function updateParams(
  searchParamsMap: Record<string, any>,
  searchParams: URLSearchParams,
  options?: ParamUpdateOptions,
): void {
  Object.keys(searchParamsMap).forEach((key) => {
    const value = searchParamsMap[key];
    searchParams = setParameterValue(key, value, searchParams);
  });
  const newUrlString = createUpdatedUrlString(searchParams, params.useHash);
  updateUrl(newUrlString, options?.updateMode);
}

export const params: ParamsFn = Object.assign(
  (key: string) => ({
    getValue(): string | undefined {
      const searchParams = getSearchParams(
        params.useHash,
        window.location.href,
      );
      const value = getParameterValue(key, searchParams);
      return value;
    },
    setValue(value: any, options?: ParamUpdateOptions): void {
      let searchParams = getSearchParams(params.useHash, window.location.href);
      searchParams = setParameterValue(key, value, searchParams);
      const newUrlString = createUpdatedUrlString(searchParams, params.useHash);
      updateUrl(newUrlString, options?.updateMode);
    },
    remove(options?: ParamUpdateOptions): void {
      this.setValue(undefined, options);
    },
    watch(callback: ParamValueFn): void {
      const searchParams = getSearchParams(
        params.useHash,
        window.location.href,
      );
      const initialValue = getParameterValue(key, searchParams);
      registerValueCallback(key, initialValue, callback);
      callback(initialValue);
    },
    onChange(callback: ParamChangeFn): void {
      const searchParams = getSearchParams(
        params.useHash,
        window.location.href,
      );
      const initialValue = getParameterValue(key, searchParams);
      registerValueChangeCallback(key, initialValue, callback);
    },
  }),
  {
    useHash: false,
    snapshot(): ParamsSnapshot {
      const searchParams = getSearchParams(this.useHash, window.location.href);
      return createSnapshot(searchParams);
    },
    watch(callback: ParamsValueFn): void {
      const searchParams = getSearchParams(this.useHash, window.location.href);
      const snapshot = createSnapshot(searchParams);
      registerSnapshotCallback(callback, snapshot);
      callback(snapshot);
    },
    modifiers(): ParamModifiers {
      return {
        setOne: (key, value, options) => params(key).setValue(value, options),
        setMany(many, options): void {
          let searchParams = getSearchParams(
            params.useHash,
            window.location.href,
          );
          updateParams(many, searchParams, options);
        },
        setAll(all, options): void {
          let searchParams = getSearchParams(params.useHash, '');
          updateParams(all, searchParams, options);
        },
      };
    },
  },
);
