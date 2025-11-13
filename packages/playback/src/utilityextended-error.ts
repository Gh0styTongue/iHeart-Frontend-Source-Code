export type ExtendedErrorOptions<Code extends string> = {
  code: Code;
  data?: unknown;
  message: string;
  name?: string;
  meta?: string;
};

export type ExtendedErrorFactoryOptions<Code extends string> = Omit<
  ExtendedErrorOptions<Code>,
  'message'
> & { message?: string; meta?: string };

export class ExtendedError<Code extends string> extends globalThis.Error {
  meta?: string;
  code: Code;
  data?: ExtendedErrorOptions<Code>['data'];
  override message: ExtendedErrorOptions<Code>['message'];
  override name: NonNullable<ExtendedErrorOptions<Code>['name']>;

  constructor({
    code,
    data,
    message = '',
    meta,
    name = 'ExtendedError',
  }: ExtendedErrorOptions<Code>) {
    super(message);
    Object.setPrototypeOf(this, ExtendedError.prototype);
    Object.defineProperties(this, {
      message: {
        enumerable: true,
        writable: true,
      },
      code: {
        enumerable: true,
        writable: true,
      },
      data: {
        enumerable: true,
        writable: true,
      },
      meta: {
        enumerable: true,
        writable: true,
      },
    });

    this.code = code;
    this.data = data;
    this.message = message;
    this.name = name;
    this.meta = meta;
  }
}
