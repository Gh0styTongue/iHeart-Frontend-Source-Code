import { createEmitter } from '../create-emitter/index.js';
import { type Logger, createLogger } from '../create-logger/index.js';

export function createSafeInterval(
  logger = createLogger({
    enabled: true,
    namespace: '@iheartradio/web.utilities:safe-interval',
  }),
) {
  if (!globalThis.window) {
    logger.warn(
      "Don't use createSafeInterval on the server! Returning an emitter with no-ops",
    );
    return createEmitter({
      has(_id: string): boolean {
        logger.warn("Don't use createSafeInterval on the server");
        return false;
      },
      clear(_id: string): boolean {
        logger.warn("Don't use createSafeInterval on the server");
        return false;
      },
      clearAll(): void {
        logger.warn("Don't use createSafeInterval on the server");
      },
      set(_id: string, _callback: () => void, _intervalPeriod: number): number {
        logger.warn("Don't use createSafeInterval on the server");
        return -1;
      },
      setLogger(_logger: Logger) {
        logger.warn("Don't use createSafeInterval on the server");
      },
      size() {
        return -1;
      },
    });
  }

  const _intervals = new Map<symbol, number>();
  let intervalLogger = logger;

  return createEmitter({
    has(id: string): boolean {
      const intervalKey = Symbol.for(id);
      return _intervals.has(intervalKey);
    },
    clear(id: string): boolean {
      const intervalKey = Symbol.for(id);

      if (!_intervals.has(intervalKey)) {
        logger.warn(
          `Attempting to clear interval: ${id} that has not been previously set`,
        );
      }

      globalThis.window.clearInterval(_intervals.get(intervalKey));
      return _intervals.delete(intervalKey);
    },
    clearAll(): Record<symbol, boolean> {
      intervalLogger.warn(
        'Clearing ALL intervals, be sure you want to do this',
      );

      const statuses: Record<symbol, boolean> = {};
      for (const [intervalKey, intervalId] of _intervals.entries()) {
        globalThis.window.clearInterval(intervalId);
        statuses[intervalKey] = _intervals.delete(intervalKey);
      }

      return statuses;
    },
    set(id: string, callback: () => void, intervalPeriod: number): number {
      const intervalKey = Symbol.for(id);

      if (_intervals.has(intervalKey)) {
        intervalLogger.warn(
          `Interval "${id}" already exists! Clearing and resetting...`,
        );
        globalThis.window.clearInterval(_intervals.get(intervalKey));
        _intervals.delete(intervalKey);
      }

      const intervalId = globalThis.window.setInterval(
        callback,
        intervalPeriod,
      );

      _intervals.set(intervalKey, intervalId);

      return intervalId;
    },
    setLogger(logger: Logger) {
      intervalLogger = logger;
    },
    size() {
      return _intervals.size;
    },
  });
}

export type SafeInterval = ReturnType<typeof createSafeInterval>;
