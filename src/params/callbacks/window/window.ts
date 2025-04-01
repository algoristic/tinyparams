/// <reference path="window.model.ts">

import {
  CallbackRegistry,
  ParamChangeFn,
  ParamsValueFn,
  ParamValueFn,
} from '../callbacks.model';
import { ParamsStore } from '../store/store';

window._paramsValueListeners = new CallbackRegistry<ParamsValueFn>();
window._paramValueListeners = new CallbackRegistry<ParamValueFn>();
window._paramChangeListeners = new CallbackRegistry<ParamChangeFn>();
window._paramValueStore = new ParamsStore();

export function getParamsValueListeners(): CallbackRegistry<ParamsValueFn> {
  return window._paramsValueListeners;
}

export function getParamValueListeners(): CallbackRegistry<ParamValueFn> {
  return window._paramValueListeners;
}

export function getParamChangeListeners(): CallbackRegistry<ParamChangeFn> {
  return window._paramChangeListeners;
}

export function getParamsStore(): ParamsStore {
  return window._paramValueStore;
}
