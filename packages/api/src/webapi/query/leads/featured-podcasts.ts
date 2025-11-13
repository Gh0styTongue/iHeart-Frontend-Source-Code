import { gql } from 'graphql-request';

import type {
  FeaturedPodcastsQuery,
  FeaturedPodcastsQueryVariables,
} from '../../../generated/webapi-types.js';
import type { GraphQLOperation } from '../../client.js';
import { Collections } from './constants.js';
import { CardFragment } from './fragments.js';

export type FeaturedPodcastsRequestData = {
  countryCode: string;
  locale: string;
  limit?: number;
};

const queryDocument = gql`
  ${CardFragment}

  query FeaturedPodcasts($query: QueryInput!, $locale: String) {
    featured_podcasts: leads(query: $query, locale: $locale) {
      ...commonCardFields
    }
  }
`;

export const featuredPodcasts = (
  data: FeaturedPodcastsRequestData,
): GraphQLOperation<FeaturedPodcastsQueryVariables, FeaturedPodcastsQuery> => {
  const { countryCode, locale, limit } = data;

  return {
    document: queryDocument,
    variables: {
      locale,
      query: {
        limit,
        subscription: [
          {
            tags: [Collections.FeaturedPodcasts, `countries/${countryCode}`],
          },
        ],
      },
    },
  };
};
