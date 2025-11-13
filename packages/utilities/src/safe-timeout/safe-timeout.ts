import { createEmitter } from '../create-emitter/index.js';
import { type Logger, createLogger } from '../create-logger/index.js';

type SetTimeout = {
  timerId: number;
  cancel: () => boolean;
};

export const createSafeTimeout = (
  logger = createLogger({
    enabled: true,
    namespace: '@iheartradio/web.utilities:safe-timeout',
  }),
) => {
  if (!globalThis.window) {
    logger.warn(
      "Don't use createSafeTimeout on the server! Returning an emitter with no-ops",
    );
    return createEmitter({
      clear(_id: string): boolean {
        logger.warn("Don't use createSafeTimeout on the server");
        return false;
      },
      clearAll(): void {
        logger.warn("Don't use createSafeTimeout on the server");
      },
      set(
        _id: string,
        _callback: () => void,
        _timeoutDelay: number,
      ): SetTimeout {
        logger.warn("Don't use createSafeTimeout on the server");
        return {
          timerId: -1,
          cancel: () => false,
        };
      },
      setLogger(_logger: Logger) {
        logger.warn("Don't use createSafeTimeout on the server");
      },
      size() {
        return -1;
      },
    });
  }

  const _timeouts = new Map<symbol, number>();
  let timeoutLogger = logger;

  return createEmitter({
    clear(id: string): boolean {
      const timeoutKey = Symbol.for(id);

      if (!_timeouts.has(timeoutKey)) {
        logger.warn(
          `Attempting to clear timeout: ${id} that has not been previously set`,
        );
      }

      globalThis.window.clearTimeout(_timeouts.get(timeoutKey));
      return _timeouts.delete(timeoutKey);
    },
    clearAll(): void {
      timeoutLogger.warn('Clearing ALL timeouts, be sure you want to do this');

      for (const [timeoutKey, timeoutId] of _timeouts.entries()) {
        globalThis.window.clearTimeout(timeoutId);
        _timeouts.delete(timeoutKey);
      }
    },
    set(id: string, callback: () => void, timeoutDelay: number): SetTimeout {
      const timeoutKey = Symbol.for(id);

      if (_timeouts.has(timeoutKey)) {
        timeoutLogger.warn(
          `Timeout "${id}" already exists! Clearing and resetting...`,
        );
        globalThis.window.clearTimeout(_timeouts.get(timeoutKey));
        _timeouts.delete(timeoutKey);
      }

      const timerId = globalThis.window.setTimeout(() => {
        callback();
        _timeouts.delete(timeoutKey);
      }, timeoutDelay);

      _timeouts.set(timeoutKey, timerId);

      return {
        timerId,
        cancel: () => {
          globalThis.window.clearTimeout(timerId);
          return _timeouts.delete(timeoutKey);
        },
      };
    },
    setLogger(logger: Logger) {
      timeoutLogger = logger;
    },
    size() {
      return _timeouts.size;
    },
  });
};

export type SafeTimeout = ReturnType<typeof createSafeTimeout>;
