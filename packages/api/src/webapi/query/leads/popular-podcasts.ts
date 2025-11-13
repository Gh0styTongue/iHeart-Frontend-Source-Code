import { gql } from 'graphql-request';

import type {
  PopularPodcastsQuery,
  PopularPodcastsQueryVariables,
} from '../../../generated/webapi-types.js';
import type { GraphQLOperation } from '../../client.js';
import { Collections } from './constants.js';
import { CardFragment } from './fragments.js';

export type PopularPodcastsRequestData = {
  countryCode: string;
  locale: string;
  limit?: number;
};

const queryDocument = gql`
  ${CardFragment}

  query PopularPodcasts($query: QueryInput!, $locale: String) {
    popular_podcasts: leads(query: $query, locale: $locale) {
      ...commonCardFields
    }
  }
`;

export const popularPodcasts = (
  data: PopularPodcastsRequestData,
): GraphQLOperation<PopularPodcastsQueryVariables, PopularPodcastsQuery> => {
  const { countryCode, locale, limit } = data;

  return {
    document: queryDocument,
    variables: {
      locale,
      query: {
        limit,
        subscription: [
          {
            tags: [Collections.PopularPodcasts, `countries/${countryCode}`],
          },
        ],
      },
    },
  };
};
