import { gql } from 'graphql-request';
import { z } from 'zod';

import type { PlaylistDirectoryQueryVariables } from '../../../generated/webapi-types.js';
import type { GraphQLOperation } from '../../client.js';
import { Collections } from './constants.js';
import { CardFragment } from './fragments.js';

export type PlaylistsDirectoryRequestData = {
  countryCode: string;
  category: string;
  subcategory: string;
  locale: string;
  limit?: number;
};

export const PlaylistSubdirectoryResponseSchema = z.object({
  playlist_subdirectory: z.array(
    z.object({
      id: z.string(),
      img_uri: z.string().nullable(),
      subtitle: z.string().nullable(),
      title: z.string(),
      catalog: z.object({
        id: z.string(),
        isPremium: z.boolean().nullable().optional(),
      }),
      link: z.object({
        urls: z.object({
          web: z.string(),
          device: z.string().nullable().optional(),
        }),
      }),
    }),
  ),
});

export type PlaylistSubdirectoryResponse = z.infer<
  typeof PlaylistSubdirectoryResponseSchema
>;

const queryDocument = gql`
  ${CardFragment}

  query PlaylistSubdirectory($query: QueryInput!, $locale: String) {
    playlist_subdirectory: leads(query: $query, locale: $locale) {
      ...commonCardFields
    }
  }
`;

export const playlistGenres = (
  data: PlaylistsDirectoryRequestData,
): GraphQLOperation<
  PlaylistDirectoryQueryVariables,
  PlaylistSubdirectoryResponse
> => {
  const { countryCode, category, subcategory, locale, limit } = data;

  return {
    document: queryDocument,
    variables: {
      locale,
      query: {
        limit,
        subscription: [
          {
            tags: [
              Collections.PlaylistGenres,
              `countries/${countryCode}`,
              `${category}/${subcategory}`,
            ] as string[],
          },
        ],
      },
    },
  };
};
