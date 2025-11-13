import { gql } from 'graphql-request';

import type {
  PodcastTopicsQuery,
  PodcastTopicsQueryVariables,
} from '../../../generated/webapi-types.js';
import type { GraphQLOperation } from '../../index.js';
import { Collections } from './constants.js';
import { CardFragment } from './fragments.js';

type TopicsRequestData = {
  countryCode: string;
  locale: string;
  limit?: number;
};

const queryDocument = gql`
  ${CardFragment}

  query PodcastTopics($query: QueryInput!, $locale: String) {
    podcast_topics: leads(query: $query, locale: $locale) {
      ...commonCardFields
    }
  }
`;

export const podcastTopics = (
  data: TopicsRequestData,
): GraphQLOperation<PodcastTopicsQueryVariables, PodcastTopicsQuery> => {
  const { countryCode, locale, limit } = data;

  return {
    document: queryDocument,
    variables: {
      locale,
      query: {
        limit,
        subscription: [
          {
            tags: [Collections.PodcastDirectory, `countries/${countryCode}`],
          },
        ],
      },
    },
  };
};
