import { isPlainObject } from 'remeda';

import type { Amp } from '../amp/index.js';
import { ContentType } from '../httpUtils/constants.js';

export class HTTPError extends Error {
  public response?: Response | null;
  public request: Request;
  public extra?: object;

  static new(response: Response, request: Request, extra: object = {}) {
    return new HTTPError(response, request, extra);
  }

  constructor(response: Response, request: Request, extra: object = {}) {
    const code =
      response.status || (response.status === 0 ? response.status : '');
    const title = response.statusText || '';
    const status = `${code} ${title}`.trim();
    const reason = status ? `status code ${status}` : 'an unknown error';

    super(`Request failed with ${reason}`);

    this.name = 'HTTPError';
    this.response = response;
    this.request = request;
    this.extra = extra;
  }

  private buildErrorPaths(body: unknown) {
    return body && typeof body === 'object' ?
        Object.entries(body).reduce((accumulator, [key, value]) => {
          if (['errors', 'error', 'firstError'].includes(key)) {
            accumulator.push(value);
          } else if (typeof value === 'object') {
            accumulator.push(...this.buildErrorPaths(value));
          }

          return accumulator;
        }, [] as Array<unknown>)
      : [];
  }

  async getResponseErrors(): Promise<Array<Amp.ErrorEntry>> {
    if (!this.response || !this.response.body)
      return [] as Array<Amp.ErrorEntry>;

    try {
      return this.buildErrorPaths(
        await this.response.clone().json(),
      ).flat() as Array<Amp.ErrorEntry>;
    } catch {
      return [] as Array<Amp.ErrorEntry>;
    }
  }

  async getRequestPayload() {
    const [contentType] =
      (this.request.headers?.get('Content-Type') ?? '').split(';') ?? [];

    if (!contentType) return null;

    try {
      switch (contentType) {
        case ContentType.Json: {
          return await this.request.clone().json();
        }
        case ContentType.FormUrlEncoded: {
          return Object.fromEntries(
            new URLSearchParams(await this.request.clone().text()),
          );
        }
        default: {
          return await this.request.clone().text();
        }
      }
    } catch {
      return null;
    }
  }

  async getRequestUrl() {
    return this.request.url;
  }
}

export interface AmpErrorResponse {
  errors: Amp.ErrorEntry[];
  firstError?: Amp.ErrorEntry;
}

export function isAmpErrorResponse(
  something: unknown,
): something is AmpErrorResponse {
  return (
    something != null &&
    isPlainObject(something) &&
    'errors' in something &&
    Array.isArray(something?.errors) &&
    something?.errors.length > 0
  );
}
