import { params } from './params';

const useHashToggles = [false, true];

const standardRoutingUrls = [
  'http://localhost/path/of/my/app',
  'http://localhost/path/of/my/app#heading-1',
  'http://localhost/path/of/my/app?foo=bar',
  'http://localhost/path/of/my/app?foo=bar&answer=42&debug=true',
  'http://localhost/path/of/my/app?foo=bar&answer=42&debug=true#heading-1',
];
const hashRoutingUrls = [
  'http://localhost/',
  'http://localhost/#?foo=bar',
  'http://localhost/#/path/of/my/app',
  'http://localhost/#/path/of/my/app?foo=bar',
  'http://localhost/#/path/of/my/app?foo=bar&answer=42&debug=true',
];

for (const useHash of useHashToggles) {
  const urls = useHash ? hashRoutingUrls : standardRoutingUrls;

  describe(useHash ? 'hash routing' : 'standard routing', () => {
    beforeAll(() => {
      params.useHash = useHash;
    });

    for (const url of urls) {
      describe(`url: ${url}`, () => {
        beforeEach(() => {
          Object.defineProperty(window, 'location', {
            value: new URL(url),
            writable: true,
          });
        });

        describe('read values', () => {
          it('reading the value of an existing parameter', () => {
            if (url.includes('bar')) {
              expect(params('foo').getValue()).toBe('bar');
            } else {
              expect(params('foo').getValue()).toBeUndefined();
            }
          });

          it('reading `undefined` for a non-existent parameter', () => {
            expect(params('fizz').getValue()).toBeUndefined();
          });
        });

        describe('write values', () => {
          it('write new value of a parameter', () => {
            const pushStateSpy = jest.spyOn(history, 'pushState');
            params('foo').setValue(false);

            if (useHash) {
              const expectedUrl = new URL(
                url.includes('foo')
                  ? url.replace('bar', 'false')
                  : url.includes('#')
                    ? url.concat('?foo=false')
                    : url.concat('#?foo=false'),
              );
              const expectedResult =
                expectedUrl.pathname + expectedUrl.search + expectedUrl.hash;
              expect(pushStateSpy).toHaveBeenLastCalledWith(
                null,
                '',
                expectedResult,
              );
            } else {
              const urlTokens = url.split('#');
              const urlHash = urlTokens[1] ? '#' + urlTokens[1] : '';
              const expectedUrl = new URL(
                url.includes('foo')
                  ? url.replace('bar', 'false')
                  : urlTokens[0].concat('?foo=false') + urlHash,
              );
              const expectedResult =
                expectedUrl.pathname + expectedUrl.search + expectedUrl.hash;
              expect(pushStateSpy).toHaveBeenLastCalledWith(
                null,
                '',
                expectedResult,
              );
            }
          });

          it('replace value of a parameter', () => {
            const replaceStateSpy = jest.spyOn(history, 'replaceState');
            params('foo').setValue(false, { updateMode: 'replace' });

            if (useHash) {
              const expectedUrl = new URL(
                url.includes('foo')
                  ? url.replace('bar', 'false')
                  : url.includes('#')
                    ? url.concat('?foo=false')
                    : url.concat('#?foo=false'),
              );
              const expectedResult =
                expectedUrl.pathname + expectedUrl.search + expectedUrl.hash;
              expect(replaceStateSpy).toHaveBeenLastCalledWith(
                null,
                '',
                expectedResult,
              );
            } else {
              const urlTokens = url.split('#');
              const urlHash = urlTokens[1] ? '#' + urlTokens[1] : '';
              const expectedUrl = new URL(
                url.includes('foo')
                  ? url.replace('bar', 'false')
                  : urlTokens[0].concat('?foo=false') + urlHash,
              );
              const expectedResult =
                expectedUrl.pathname + expectedUrl.search + expectedUrl.hash;
              expect(replaceStateSpy).toHaveBeenLastCalledWith(
                null,
                '',
                expectedResult,
              );
            }
          });

          it('remove parameter value', () => {
            const pushStateSpy = jest.spyOn(history, 'pushState');
            params('foo').remove();

            if (useHash) {
              const expectedUrl = new URL(
                url.includes('foo')
                  ? url.replace('foo=bar&', '').replace('foo=bar', '')
                  : url.includes('#')
                    ? url.concat('?')
                    : url.concat('#?'),
              );
              const expectedResult =
                expectedUrl.pathname + expectedUrl.search + expectedUrl.hash;
              expect(pushStateSpy).toHaveBeenLastCalledWith(
                null,
                '',
                expectedResult,
              );
            } else {
              const urlTokens = url.split('#');
              const urlBase = urlTokens[0];
              const urlHash = urlTokens[1] ? '#' + urlTokens[1] : '';
              let expectedUrlString =
                '?' +
                (urlBase.includes('?') ? urlBase : urlBase.concat('?')).split(
                  '?',
                )[1];
              expectedUrlString = expectedUrlString.includes('foo')
                ? expectedUrlString
                    .replace('foo=bar&', '')
                    .replace('foo=bar', '')
                : expectedUrlString;
              expectedUrlString += urlHash;
              const expectedResult = new URL(url).pathname + expectedUrlString;
              expect(pushStateSpy).toHaveBeenLastCalledWith(
                null,
                '',
                expectedResult,
              );
            }
          });

          it('effectively remove parameter value', () => {
            const pushStateSpy = jest.spyOn(history, 'pushState');
            params('foo').setValue(undefined);

            if (useHash) {
              const expectedUrl = new URL(
                url.includes('foo')
                  ? url.replace('foo=bar&', '').replace('foo=bar', '')
                  : url.includes('#')
                    ? url.concat('?')
                    : url.concat('#?'),
              );
              const expectedResult =
                expectedUrl.pathname + expectedUrl.search + expectedUrl.hash;
              expect(pushStateSpy).toHaveBeenLastCalledWith(
                null,
                '',
                expectedResult,
              );
            } else {
              const urlTokens = url.split('#');
              const urlBase = urlTokens[0];
              const urlHash = urlTokens[1] ? '#' + urlTokens[1] : '';
              let expectedUrlString =
                '?' +
                (urlBase.includes('?') ? urlBase : urlBase.concat('?')).split(
                  '?',
                )[1];
              expectedUrlString = expectedUrlString.includes('foo')
                ? expectedUrlString
                    .replace('foo=bar&', '')
                    .replace('foo=bar', '')
                : expectedUrlString;
              expectedUrlString += urlHash;
              const expectedResult = new URL(url).pathname + expectedUrlString;
              expect(pushStateSpy).toHaveBeenLastCalledWith(
                null,
                '',
                expectedResult,
              );
            }
          });
        });

        describe('perform callback on change', () => {
          it('when writing the value of a parameter', () => {
            let next: any = '';
            let prev: any = '';
            params('foo').onChange((newValue, oldValue) => {
              next = newValue;
              prev = oldValue;
            });
            params('foo').setValue(123);

            if (url.includes('foo')) {
              expect(prev).toBe('bar');
            } else {
              expect(prev).toBeUndefined();
            }
            expect(next).toBe('123');
          });

          it('when removing the value of a parameter', () => {
            let next: any = undefined;
            let prev: any = undefined;
            params('foo').onChange((newValue, oldValue) => {
              next = newValue;
              prev = oldValue;
            });
            params('foo').setValue(undefined);

            if (url.includes('foo')) {
              expect(prev).toBe('bar');
            } else {
              expect(prev).toBeUndefined();
            }
            expect(next).toBe(undefined);
          });

          it('with multiple registered callbacks in the correct order', () => {
            const firstCallback = jest.fn();
            const secondCallback = jest.fn();
            params('foo').onChange(firstCallback);
            params('foo').onChange(secondCallback);
            params('foo').setValue(123);

            expect(firstCallback).toHaveBeenCalledTimes(1);
            expect(secondCallback).toHaveBeenCalledTimes(1);
            expect(firstCallback.mock.invocationCallOrder[0]).toBeLessThan(
              secondCallback.mock.invocationCallOrder[0],
            );
          });

          it('when setting a parameter and then removing it', () => {
            let newParam: any = undefined;
            params('newParam').onChange((newValue) => {
              newParam = newValue;
            });
            expect(newParam).toBeUndefined();

            params('newParam').setValue('is_set');
            expect(newParam).toBe('is_set');

            params('newParam').remove();
            expect(newParam).toBeUndefined();
          });
        });

        describe('perform value callback', () => {
          it('when writing the value of a parameter', () => {
            const initialValue =
              new URLSearchParams(
                useHash ? (url.split('?')[1] ?? '') : new URL(url).search,
              ).get('foo') ?? undefined;
            let newValue: any = '';
            params('foo').watch((value) => {
              newValue = value;
            });
            expect(newValue).toBe(initialValue);

            params('foo').setValue(123);
            expect(newValue).toBe('123');
          });

          it('when removing the value of a parameter', () => {
            const initialValue =
              new URLSearchParams(
                useHash ? (url.split('?')[1] ?? '') : new URL(url).search,
              ).get('foo') ?? undefined;
            let newValue: any = '';
            params('foo').watch((value) => {
              newValue = value;
            });
            expect(newValue).toBe(initialValue);

            params('foo').setValue(undefined);
            expect(newValue).toBe(undefined);
          });
        });

        describe('create a snapshot of the current state', () => {
          it('detect all param keys in route', () => {
            const keys: string[] = [];
            if (url.includes('foo')) keys.push('foo');
            if (url.includes('answer')) keys.push('answer');
            if (url.includes('debug')) keys.push('debug');

            expect(
              params
                .snapshot()
                .keys()
                .every((key) => keys.includes(key)),
            ).toBeTruthy();
          });

          it('create snapshot of all params', () => {
            const entries: [string, string][] = [];
            if (url.includes('foo')) entries.push(['foo', 'bar']);
            if (url.includes('answer')) entries.push(['answer', '42']);
            if (url.includes('debug')) entries.push(['debug', 'true']);

            expect(params.snapshot().keys().length).toBe(entries.length);
            expect(params.snapshot().entries().length).toBe(entries.length);
            for (const [key, expectedValue] of entries) {
              expect(params.snapshot().get(key)).toBe(expectedValue);
              params
                .snapshot()
                .entries()
                .filter((param) => param.key === key)
                .forEach((param) => {
                  expect(param.value).toBe(expectedValue);
                });
            }
          });
        });

        describe('watch all param changes', () => {
          it('detect initial value of existing params', () => {
            let answer: any = undefined;
            params.watch((snapshot) => {
              answer = snapshot.get('answer');
            });
            if (url.includes('answer')) {
              expect(answer).toBe('42');
            } else {
              expect(answer).toBeUndefined();
            }
          });

          it('detect changes of existing and new params', () => {
            let answer: any = undefined;
            params.watch((snapshot) => {
              answer = snapshot.get('answer');
            });
            params('answer').setValue(100);
            expect(answer).toBe('100');
          });

          it('detect deletion of any param', () => {
            let debug: any = '';
            params.watch((snapshot) => {
              debug = snapshot.get('debug');
            });
            params('debug').remove();
            expect(debug).toBeUndefined();
          });
        });

        describe('modify many params at once', () => {
          it('modify just one param', () => {
            let answer: any = undefined;
            params('answer').watch((value) => {
              answer = value;
            });
            params.modifiers().setOne('answer', 100);
            const expectedResult = '100';
            expect(answer).toBe(expectedResult);
          });

          it('modify multiple params', () => {
            let foo: any = undefined;
            let answer: any = undefined;
            let debug: any = undefined;
            params.watch((snapshot) => {
              foo = snapshot.get('foo');
              answer = snapshot.get('answer');
              debug = snapshot.get('debug');
            });

            params.modifiers().setMany({ answer: 100, debug: false });
            expect(answer).toBe('100');
            expect(debug).toBe('false');
            if (url.includes('foo')) {
              expect(foo).toBe('bar');
            } else {
              expect(foo).toBeUndefined();
            }
          });

          it('override all params', () => {
            let foo: any = undefined;
            let answer: any = undefined;
            let debug: any = undefined;
            params.watch((snapshot) => {
              foo = snapshot.get('foo');
              answer = snapshot.get('answer');
              debug = snapshot.get('debug');
            });

            params.modifiers().setAll({ answer: 100, debug: false });
            expect(foo).toBeUndefined();
            expect(answer).toBe('100');
            expect(debug).toBe('false');
          });
        });
      });
    }
  });
}
