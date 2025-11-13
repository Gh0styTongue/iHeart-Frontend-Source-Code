import { gql } from 'graphql-request';

import type {
  FeaturedPlaylistsQuery,
  FeaturedPlaylistsQueryVariables,
} from '../../../generated/webapi-types.js';
import type { GraphQLOperation } from '../../client.js';
import { Facets } from './constants.js';
import { CardFragment } from './fragments.js';

export type FeaturedPlaylistsRequestData = {
  countryCode: string;
  locale: string;
  limit?: number;
};

const queryDocument = gql`
  ${CardFragment}

  query FeaturedPlaylists($query: QueryInput!, $locale: String) {
    featured_playlists: leads(query: $query, locale: $locale) {
      ...commonCardFields
    }
  }
`;

export const featuredPlaylists = (
  data: FeaturedPlaylistsRequestData,
): GraphQLOperation<
  FeaturedPlaylistsQueryVariables,
  FeaturedPlaylistsQuery
> => {
  const { countryCode, locale, limit } = data;

  return {
    document: queryDocument,
    variables: {
      locale,
      query: {
        limit,
        subscription: [
          {
            tags: [Facets.FeaturedPlaylists, `countries/${countryCode}`],
          },
        ],
      },
    },
  };
};
