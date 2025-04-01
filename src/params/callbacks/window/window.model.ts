import {
  CallbackRegistry,
  ParamChangeFn,
  ParamsValueFn,
  ParamValueFn,
} from '../callbacks.model';
import { ParamsStore } from '../store/store';

declare global {
  interface Window {
    _paramsValueListeners: CallbackRegistry<ParamsValueFn>;
    _paramValueListeners: CallbackRegistry<ParamValueFn>;
    _paramChangeListeners: CallbackRegistry<ParamChangeFn>;
    _paramValueStore: ParamsStore;
  }
}
