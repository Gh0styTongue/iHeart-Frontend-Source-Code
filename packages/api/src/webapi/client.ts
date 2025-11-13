import type {
  BatchRequestDocument,
  BatchRequestsOptions,
  RequestOptions,
  ResponseMiddleware,
  Variables,
} from 'graphql-request';
import { GraphQLClient } from 'graphql-request';
import { isNonNullish } from 'remeda';

import { isServer } from '../utils.js';
import { logger } from './logger.js';
import { queries } from './query/index.js';

export type GraphQLOperation<
  V extends Variables = Variables,
  _R = any,
> = BatchRequestDocument<V>;

export type InferGraphQLOperationResponse<
  T extends GraphQLOperation<any, any>,
> = T extends GraphQLOperation<infer _I, infer R> ? R : never;

export type GetResponseTypes<T> = {
  [K in keyof T]: {
    data: T[K] extends GraphQLOperation ? InferGraphQLOperationResponse<T[K]>
    : never;
  };
};

export type CreateWebAPIClientOptions = {
  client?: GraphQLClient;
  endpoint?: string;
};

export type WebAPIClient = ReturnType<typeof createWebAPIClient>;

// Copy the 'emits' array from 'extensions' into 'data' (for use in Surrogate Keys, where appropriate)
const responseMiddleware: ResponseMiddleware = response => {
  if (
    response &&
    !(response instanceof Error) &&
    'data' in response &&
    response?.data &&
    'extensions' in response &&
    response?.extensions &&
    'emits' in (response?.extensions as object)
  ) {
    Reflect.set(
      response.data as Record<string, any>,
      'emits',
      (response.extensions as Record<string, any>).emits as Array<string>,
    );
  }
};

export const createWebAPIClient = (
  factoryOptions: CreateWebAPIClientOptions,
) => {
  factoryOptions.client ??= new GraphQLClient(
    factoryOptions.endpoint ?? 'https://webapi.radioedit.iheart.com/graphql',
    {
      errorPolicy: 'all',
      method: 'GET',
      responseMiddleware,
    },
  );

  const { client } = factoryOptions;

  const batchRequests = async <
    const O extends Record<string, GraphQLOperation>,
  >(
    operations: O,
    options?: Omit<BatchRequestsOptions, 'documents'>,
  ): Promise<GetResponseTypes<O>> => {
    const operationEntries = Object.entries(operations);
    const operationKeys = operationEntries.map(([key]) => key);
    const operationDocuments = operationEntries.map(([_key, value]) => value);

    try {
      const results = await client.batchRequests({
        documents: operationDocuments,
        ...options,
        signal: AbortSignal.any(
          [
            // On the server, combine any provided signal with a timeout signal (set to 3 seconds)
            isServer ? AbortSignal.timeout(3000) : undefined,
            options?.signal,
          ].filter(isNonNullish),
        ),
      });

      const resultsWithKeys = Object.fromEntries(
        results.map((result, index) => [operationKeys[index], result]),
      );

      return resultsWithKeys as GetResponseTypes<O>;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        logger.error('Request was aborted:', {
          ...options,
          documents: operationDocuments,
        });
      }

      throw error;
    }
  };

  const request = async <
    O extends GraphQLOperation = GraphQLOperation<any, any>,
  >(
    operation: O,
    options?: Pick<RequestOptions, 'requestHeaders' | 'signal'>,
  ) => {
    try {
      const response = await client.request<
        InferGraphQLOperationResponse<typeof operation>
      >({
        ...options,
        signal: AbortSignal.any(
          [
            // On the server, combine any provided signal with a timeout signal (set to 3 seconds)
            isServer ? AbortSignal.timeout(3000) : undefined,
            options?.signal,
          ].filter(isNonNullish),
        ),
        ...operation,
      });

      return response as InferGraphQLOperationResponse<typeof operation>;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        logger.error('Request was aborted:', options);
      }

      throw error;
    }
  };

  return {
    queries,
    mutations: {},
    client,
    batchRequests,
    request,
  };
};
