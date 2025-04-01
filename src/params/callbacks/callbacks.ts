import { extendedPushState, extendedReplaceState } from '../history/history';
import { params } from '../params';
import { ParamsSnapshot } from '../params.model';
import { getSearchParams } from '../search-params/search-params';
import { createSnapshot } from '../snapshot/snapshot';
import { ParamChangeFn, ParamsValueFn, ParamValueFn } from './callbacks.model';
import { areKeysMatching } from './callbacks.util';
import {
  getParamChangeListeners,
  getParamsStore,
  getParamsValueListeners,
  getParamValueListeners,
} from './window/window';

history.pushState = extendedPushState;
history.replaceState = extendedReplaceState;

window.addEventListener('locationchange', (event) => {
  const locationChangeEvent = event as CustomEvent;
  const url: string | URL | undefined | null = locationChangeEvent.detail.url;
  if (!url) {
    return;
  }

  let urlString: string;
  if (typeof url === 'object') {
    urlString = url.toString();
  } else {
    urlString = url;
  }

  detectChanges(urlString, params.useHash);
});

function detectChanges(url: string, useHash: boolean): void {
  const searchParams = getSearchParams(useHash, url);
  const snapshot = createSnapshot(searchParams);
  let hasChanges = false;
  getParamsStore()
    .keys()
    .forEach((key) => {
      const oldValue = getParamsStore().get(key);
      const newValue = snapshot.get(key);
      if (oldValue === newValue) {
        return;
      }
      hasChanges = true;
      getParamsStore().set(key, newValue);
      dispatchValueCallbacks(key, newValue);
      dispatchValueChangeCallbacks(key, newValue, oldValue);
    });

  if (!hasChanges && areKeysMatching(snapshot, getParamsStore())) {
    return;
  }
  snapshot.entries().forEach(({ key, value }) => {
    getParamsStore().set(key, value);
  });
  dispatchSnapshotCallbacks(snapshot);
}

export function registerSnapshotCallback(
  callback: ParamsValueFn,
  snapshot: ParamsSnapshot,
): void {
  getParamsValueListeners().register('_params_', callback);
  snapshot.entries().forEach(({ key, value }) => {
    getParamsStore().set(key, value);
  });
}

export function registerValueCallback(
  key: string,
  initialValue: string | undefined,
  callback: ParamValueFn,
): void {
  getParamValueListeners().register(key, callback);
  getParamsStore().set(key, initialValue);
}

export function registerValueChangeCallback(
  key: string,
  initialValue: string | undefined,
  callback: ParamChangeFn,
): void {
  getParamChangeListeners().register(key, callback);
  getParamsStore().set(key, initialValue);
}

function dispatchSnapshotCallbacks(snapshot: ParamsSnapshot): void {
  getParamsValueListeners()
    .entries('_params_')
    .forEach((callback) => {
      callback(snapshot);
    });
}

function dispatchValueCallbacks(key: string, value: string | undefined): void {
  getParamValueListeners()
    .entries(key)
    .forEach((callback) => {
      callback(value);
    });
}

function dispatchValueChangeCallbacks(
  key: string,
  newValue: string | undefined,
  oldValue: string | undefined,
): void {
  getParamChangeListeners()
    .entries(key)
    .forEach((callback) => {
      callback(newValue, oldValue);
    });
}
