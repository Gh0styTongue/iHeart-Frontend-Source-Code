import type { CreateEmitter } from '../create-emitter/index.js';

export enum Level {
  Log = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
}

export enum Type {
  Error = 'error',
  Info = 'info',
  Log = 'log',
  Warn = 'warn',
}

export type Data = any;

export type Tags = Array<string>;

export type Log<T extends Type> = Readonly<{
  data: Data;
  message: string;
  timestamp: string;
  tags: Tags;
  trace?: string;
  type: T;
}>;

export type LogFn<T extends Type> = (
  message: string,
  data?: Data,
  tags?: Tags,
) => Promise<Log<T>>;

export type Methods = Readonly<{
  error: LogFn<Type.Error>;
  info: LogFn<Type.Info>;
  log: LogFn<Type.Log>;
  warn: LogFn<Type.Warn>;
}>;

export type Logger = CreateEmitter.Emitter<Methods>;
