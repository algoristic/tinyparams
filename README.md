# @algoristic/tinyparams

> Get, set and watch url query parameters without any dependencies.

## Basic concepts

This library makes use of the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) to modify the browser URL for best integration with [SPAs](https://en.wikipedia.org/wiki/Single-page_application).

By default, all updates take place using [`history.pushState`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState), but every method that modifies parameters has the option to use [`history.replaceState`](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState) instead. (See section ['Single parameters'](#single-parameters) for examples.)

Updates to parameter values are detected by extending [`history.pushState`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) and [`history.replaceState`](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState) and also listing to [`popstate`](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event) events to detect URL modifications via [`history.back()`](https://developer.mozilla.org/en-US/docs/Web/API/History/back), [`history.foward()`](https://developer.mozilla.org/en-US/docs/Web/API/History/forward) and the like.

### Callbacks

Watching changes of search parameters happens through callbacks. If you want to escape the callback
hell you can just use [`@algoristic/tinyparams-async`](https://www.npmjs.com/package/@algoristic/tinyparams-async),
that acts as a [`rxjs`](https://www.npmjs.com/package/rxjs) wrapper and adds convenient
`.observe()` methods.

## Installation

```sh
npm i @algoristic/tinyparams
```

## Usage

```ts
import { params } from '@algoristic/tinyparams';
```

### Single parameters

#### Get a value

```ts
const foo: string | undefined = params('foo').getValue();
```

#### Set a value

```ts
params('foo').setValue('bar');
params('foo').setValue('bar', {
  updateMode: 'replace', // default 'push'
});
```

#### Remove / unset a value

```ts
params('foo').remove();
// equals to
params('foo').setValue(undefined);
```

#### Perform on changes

```ts
// url = '...?foo=bar'
params('foo').onChange((newValue, oldValue) => {
  console.log(`old=${oldValue}, new=${newValue}`);
});
params('foo').setValue('baz');
// console: 'old=bar, new=baz'
```

#### Watch values

Perform a callback on the current value when it changes.
Unlinke `.onChange` the method `.watch` starts with the initial value and only passes the current value.

```ts
// url = '...?foo=bar'
params('foo').watch((foo) => {
  console.log(foo);
});
// console: 'bar'
params('foo').setValue('baz');
// console: 'baz'
```

### Multiple parameters

#### Snapshot

Get a snapshot of the current state of all query parameters.

```ts
const { get, keys, values } = params.snapshot();

// get value from snapshot
let value: string | undefined = get('foo');
// analogous to params('foo').getValue()

// get all parameter keys
let keys: string[] = keys();
// returns ['foo', ...]

// get all parameter key-value pairs
let values: { key: string; value: string }[] = values();
// returns [{ key: 'foo', value: 'bar' }, ...]
```

#### Watch all parameter values

Behaves similar to [`params(key).watch(...)`](#watch-values).

```ts
params.watch(({ get, keys, values }) => {
  keys = keys();
  values = values();
  ...
});
```

#### Modify multiple parameters

```ts
const { setOne, setMany, setAll } = params.modifiers();

// set one value
setOne('foo', 'bar');
// analogous to `params('foo').setValue('bar')`

// set many values (but retain existing other parameters)
setMany({ foo: 'bar', answer: 42, debug: true });

// override all query parameters
setAll({ foo: 'bar', answer: 42 });
```

## Configuration

`@algoristic/tinyparams` is fully compatible with _hash routing_ by just setting:

```ts
params.useHash = true;
```

## Personal note

This library may seem irrelevant in the age of frameworks and incredibly good routing.
But when first meeting JavaScript I wrote this abomination of a "library" for a personal
project: https://github.com/algoristic/js-url-parameters.

I keep this project publically visible to remind myself of how not to write code.
And I just _needed_ to rewrite this to prove myself I can do better now.
