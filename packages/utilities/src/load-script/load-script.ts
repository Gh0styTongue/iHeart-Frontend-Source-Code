import { isEmpty } from 'remeda';

type Options = Record<`data-${string}`, unknown> & {
  async?: boolean;
  crossorigin?: 'anonymous' | 'use-credentials';
  defer?: boolean;
  id?: string;
  integrity?: string;
  module?: boolean;
  nomodule?: boolean;
  referrerpolicy?: ReferrerPolicy;
  replace?: boolean;
  target?: HTMLElement;
};

export function loadScript(source: string, options: Options = {}) {
  if (globalThis?.document === undefined) {
    throw new Error('Scripts can only be loaded within a browser context.');
  }

  const {
    async,
    crossorigin,
    defer,
    id,
    integrity,
    nomodule,
    referrerpolicy,
    replace = false,
    target = globalThis.document.body,
  } = options;

  const dataAttributes = Object.entries(options).reduce(
    (dataset, [key, value]) => {
      if (key.startsWith('data-')) {
        dataset[key] = value;
      }
      return dataset;
    },
    {} as Record<string, unknown>,
  );

  return new Promise<Event | void>((resolve, reject) => {
    if (id && document.querySelector(`#${id}`)) {
      if (!replace) {
        resolve();
        return;
      } else {
        document.querySelector(`#${id}`)?.remove();
      }
    }

    const script = document.createElement('script');
    script.src = source;
    script.type = 'text/javascript';

    if (id) script.setAttribute('id', id);
    if (async) script.setAttribute('async', '');
    if (crossorigin) script.setAttribute('crossOrigin', crossorigin);
    if (defer) script.setAttribute('defer', '');
    if (integrity) script.setAttribute('integrity', integrity);
    if (nomodule) script.setAttribute('noModule', '');
    if (options.module) script.setAttribute('noModule', '');
    if (referrerpolicy) script.setAttribute('referrerPolicy', referrerpolicy);

    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () =>
      reject(new Error(`Failed to load script: "${source}"`)),
    );

    if (!isEmpty(dataAttributes)) {
      for (const [key, value] of Object.entries(dataAttributes)) {
        script.setAttribute(key, String(value));
      }
    }

    target.append(script);
  });
}
