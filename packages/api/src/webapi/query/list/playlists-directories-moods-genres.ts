import { gql } from 'graphql-request';

import type {
  PlaylistsDirectoriesMoodsGenresQuery,
  PlaylistsListDirectoryItemsArgs,
} from '../../../generated/webapi-types.js';
import type { GraphQLOperation } from '../../client.js';

export type playlistDirectoriesMoodsGenresRequestData = {
  countryCode: string;
  locale: string;
};

const queryDocument = (locale: string) => gql`
  query PlaylistsDirectoriesMoodsGenres($countries: [String!]!) {
    playlists {
      directories {
        moods:list(args: { countries: $countries, tags: ["collections/playlist-directory", "collections/perfect-for"], tagMatchType: EXACT }) {
          items {
            id
            metadata (locales: "locales/${locale}"){
              title
              locales
            }
            tags
            children {
              id
              tags
              metadata {
                title
                locales
              }
            }
          }
        }
        genres:list(args: {  countries: $countries, tags: ["collections/playlist-directory", "collections/genre-playlists"], tagMatchType: EXACT }) {
          items {
            id
            tags
            metadata (locales: "locales/${locale}"){
              title
              locales
            }
            tags
            children {
              id
              tags
              metadata {
                title
                locales
              }
            }
          }
        }
      }
    }
  }
`;

export const playlistDirectoriesMoodsGenres = (
  data: playlistDirectoriesMoodsGenresRequestData,
): GraphQLOperation<
  PlaylistsListDirectoryItemsArgs,
  PlaylistsDirectoriesMoodsGenresQuery
> => {
  const { countryCode, locale } = data;

  return {
    document: queryDocument(locale),
    variables: {
      countries: [`countries/${countryCode}`],
    },
  };
};
