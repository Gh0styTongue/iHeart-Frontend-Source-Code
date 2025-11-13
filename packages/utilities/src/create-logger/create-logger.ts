import { createEmitter } from '../create-emitter/index.js';
import { type LogFn, type Logger, Level, Type } from './types.js';

type Options = {
  enabled?: boolean;
  level?: Level;
  namespace?: string;
  pretty?: boolean;
};

/**
 * @remarks The {@link createLogger `createLogger()`} factory leverages the
 * {@link createEmitter `createEmitter()`} factory to build a logger. As a convenience, We have
 * already added subscriptions that leverage the native console api. Additionally, one has the
 * ability to add additional subscriptions to the logger if they so choose. Here are some things to
 * note about the `createLogger()` api before you start using it:
 *   1. All logger methods are asynchronous and return a promise.
 *   2. In production environments, the logger will only log errors.
 *   3. You can enable/disable all subscriptions to the logger.
 *   4. It works on both the client and server.
 *
 * The api for the logger includes the following methods:
 *   - {@link Logger.error `logger.log()`} - Logs a message to the console.
 *   - {@link Logger.info `logger.info()`} - Logs an info message to the console.
 *   - {@link Logger.warn `logger.warn()`} - Logs a warning message to the console.
 *   - {@link Logger.error `logger.error()`} - Logs an error message to the console.
 *   - {@link Logger.disable `logger.disable()`} - Disables all subscriptions to the logger.
 *   - {@link Logger.enable `logger.enable()`} - Enables all subscriptions to the logger.
 *   - {@link Logger.subscribe `logger.subscribe()`} - Adds a subscription to the logger.
 *
 * @param {boolean} enabled This determines whether or not subscriptions to the logger are
 * enabled/disabled.
 *
 * @param {string} namespace This provides context to distinguish which logger is firing if multiple
 * loggers are in use.
 *
 * @example
 *
 * ```tsx
 * import { createLogger } from '@iheartradio/web.utilities';
 *
 * const logger = createLogger({
 *   enabled: true,
 *   namespace: 'my-namespace',
 *   pretty: true,
 * });
 *
 * logger.log('Hello, world!');
 * ```
 */
export function createLogger({
  enabled = true,
  level = Level.Log,
  namespace = '',
  pretty = false,
}: Options = {}): Logger {
  function createLogFn<T extends Type>(type: T): LogFn<T> {
    return async function logFn(message, data, tags = []) {
      return {
        data,
        message,
        tags: namespace ? [namespace, ...tags] : tags,
        timestamp: new Date().toISOString(),
        trace: type === Type.Error ? new Error('stack').stack : undefined,
        type,
      } as const;
    };
  }

  const logger = createEmitter({
    error: createLogFn(Type.Error),
    info: createLogFn(Type.Info),
    log: createLogFn(Type.Log),
    warn: createLogFn(Type.Warn),
  });

  if (enabled === false) {
    logger.disable();
  }

  logger.subscribe({
    all(_key, log) {
      if (
        (log.type === Type.Log && level === Level.Log) ||
        (log.type === Type.Info && level <= Level.Info) ||
        (log.type === Type.Warn && level <= Level.Warn) ||
        (log.type === Type.Error && level <= Level.Error)
      ) {
        if (pretty) {
          if (globalThis?.window === undefined) {
            const title = ` ${log.type}${namespace ? `:${namespace}` : ''} `;

            const message = `${log.message} ${JSON.stringify(log, null, 2)} \n`;

            console[log.type](title, message);
          } else {
            const color = {
              [Type.Error]: {
                backgroundColor: '#F94E5C',
                borderColor: '#E22C3A',
                color: '#FFFFFF',
              },
              [Type.Info]: {
                backgroundColor: '#5FBBF0',
                borderColor: '#3CA2DD',
                color: '#FFFFFF',
              },
              [Type.Log]: {
                backgroundColor: '#96979F',
                borderColor: '#717277',
                color: '#FFFFFF',
              },
              [Type.Warn]: {
                backgroundColor: '#FDDF96',
                borderColor: '#FDCC5D',
                color: '#55565B',
              },
            }[log.type];

            const styles = `
              background-color: ${color.backgroundColor};
              border-radius: 2px;
              border: 1px solid ${color.borderColor};
              color: ${color.color};
              padding: 3px 6px;
            `;

            const title = `${log.type}${namespace ? `:${namespace}` : ''}`;

            console.groupCollapsed(`%c${title}%c ${log.message}`, styles, '');
            console.groupCollapsed('Data');
            console.log(log.data);
            console.groupEnd();
            console.groupCollapsed('Log');
            console.log(log);
            console.groupEnd();
            console.groupCollapsed('Trace');
            console.trace();
            console.groupEnd();
            console.groupEnd();
          }
        } else {
          console[log.type](log);
        }
      }
    },
  });

  return logger;
}
