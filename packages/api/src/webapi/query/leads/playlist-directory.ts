import { gql } from 'graphql-request';

import type {
  PlaylistDirectoryQuery,
  PlaylistDirectoryQueryVariables,
} from '../../../generated/webapi-types.js';
import type { GraphQLOperation } from '../../client.js';
import { type Facets, Collections } from './constants.js';
import { CardFragment } from './fragments.js';

export type PlaylistsDirectoryRequestData = {
  countryCode: string;
  facet?: Facets | string;
  locale: string;
  limit?: number;
};

const queryDocument = gql`
  ${CardFragment}

  query PlaylistDirectory($query: QueryInput!, $locale: String) {
    playlist_directory: leads(query: $query, locale: $locale) {
      ...commonCardFields
    }
  }
`;

// NOTE: Make sure query is correct. Also, make sure we get the publish_facets or category data so we can filter out each section on the front end.
export const playlistDirectory = (
  data: PlaylistsDirectoryRequestData,
): GraphQLOperation<
  PlaylistDirectoryQueryVariables,
  PlaylistDirectoryQuery
> => {
  const { countryCode, facet, locale, limit } = data;

  return {
    document: queryDocument,
    variables: {
      locale,
      query: {
        limit,
        subscription: [
          {
            tags: [
              Collections.PlaylistDirectory,
              `countries/${countryCode}`,
              facet,
            ] as string[],
          },
        ],
      },
    },
  };
};
