import { gql } from 'graphql-request';

import type {
  GetPodcastNewsQuery,
  GetPodcastNewsQueryVariables,
  PubsubQueryInput,
} from '../../../generated/webapi-types.js';
import type { GraphQLOperation } from '../../index.js';
import { PublishRecordFragment } from './fragments.js';

export const podcastNews = (
  query: PubsubQueryInput,
): GraphQLOperation<GetPodcastNewsQueryVariables, GetPodcastNewsQuery> => {
  const queryDocument = gql`
    query GetPodcastNews($query: PubsubQueryInput!) {
      pubsub {
        query(type: "content", query: $query) {
          items {
            ...PublishRecord
          }
        }
      }
    }

    ${PublishRecordFragment}
  `;

  return {
    document: queryDocument,
    variables: {
      query,
    },
  };
};
