import { gql } from 'graphql-request';

import type {
  PlaylistsDirectoriesItemsQuery,
  PlaylistsListDirectoryItemsArgs,
} from '../../../generated/webapi-types.js';
import type { GraphQLOperation } from '../../client.js';

export type PlaylistsDirectoryItemsRequestData = {
  countryCode: string;
  genre?: string;
  activity?: string;
  locale: string;
  tags?: string[];
};

const queryDocument = (locale: string) => gql`
  query PlaylistsDirectoriesItems($tags: [String!]!, $countries: [String!]!) {
    playlists {
      directories {
        list(
          args: {
            countries: $countries
            tags: $tags
            tagMatchType: EXACT
            take: 10
          }
        ) {
          items {
            id
            metadata {
              title
              subtitle
              imageUrl
              locales
            }
            children {
              id
              metadata(locales: "locales/${locale}") {
                title
                subtitle
                imageUrl
              }
              resource {
                ... on PlaylistsPlaylistRecord {
                  title
                  description
                  author
                  urlImage
                  publishedUserId
                  publishedPlaylistId
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const playlistDirectoriesItems = (
  data: PlaylistsDirectoryItemsRequestData,
): GraphQLOperation<
  PlaylistsListDirectoryItemsArgs,
  PlaylistsDirectoriesItemsQuery
> => {
  const { countryCode, locale, tags } = data;

  let query = [];

  if (tags && tags.length > 0) {
    query = tags;
  } else {
    // When there is no tags for Genres and Moods then we want to show the featured playlists
    query.push('collections/playlist-directory', 'facets/featured-playlists');
  }

  return {
    document: queryDocument(locale),
    variables: {
      tags: [...query] as string[],
      countries: [`countries/${countryCode}`],
    },
  };
};
