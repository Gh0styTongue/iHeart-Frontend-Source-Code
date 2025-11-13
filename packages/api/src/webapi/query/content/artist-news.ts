import { gql } from 'graphql-request';

import type {
  ArtistNewsContentQuery,
  ArtistNewsContentQueryVariables,
} from '../../../generated/webapi-types.js';
import type { GraphQLOperation } from '../../client.js';

const queryDocument = gql`
  query ArtistNewsContent($id: Int!) {
    artist(artistId: $id) {
      content(num: 10, offset: 0, categories: ["categories/music-news"]) {
        slug
        pub_start
        summary {
          image
          title
          description
        }
      }
    }
  }
`;

export const artistNews = (
  data: ArtistNewsContentQueryVariables,
): GraphQLOperation<
  ArtistNewsContentQueryVariables,
  ArtistNewsContentQuery
> => {
  const { id } = data;
  return {
    document: queryDocument,
    variables: {
      id,
    },
  };
};
