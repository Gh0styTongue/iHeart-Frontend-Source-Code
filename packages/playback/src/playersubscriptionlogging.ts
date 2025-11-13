import { isError, typeOf } from '@iheartradio/web.utilities';
import type { Logger } from '@iheartradio/web.utilities/create-logger';
import { isArray, isPlainObject } from 'remeda';

export function createLoggingSubscription(name: string, logger: Logger) {
  const subscription = {
    all(method: string, result: unknown, ...rest: unknown[]) {
      const prefix = `${name}.${method}(`;

      const args = rest
        .map(value =>
          isPlainObject(value) || isArray(value) || isError(value) ?
            typeOf(value)
          : JSON.stringify(value),
        )
        .join(', ');

      const suffix = `) => ${
        isPlainObject(result) || isArray(result) || isError(result) ?
          typeOf(result)
        : result === undefined ? 'void'
        : JSON.stringify(result)
      }`;

      const message = [prefix, args, suffix].join('');

      if (message.toLowerCase().includes('time')) {
        return;
      }

      const logType = message.toLowerCase().includes('error') ? 'error' : 'log';

      logger[logType](message, { arguments: rest, method, result });
    },
  } as const;

  return subscription;
}
