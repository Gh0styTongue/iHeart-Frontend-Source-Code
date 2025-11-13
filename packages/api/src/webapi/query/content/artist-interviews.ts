import { gql } from 'graphql-request';

import type {
  ArtistInterviewsContentQuery,
  ArtistInterviewsContentQueryVariables,
} from '../../../generated/webapi-types.js';
import type { GraphQLOperation } from '../../client.js';

const queryDocument = gql`
  query ArtistInterviewsContent($id: Int!) {
    artist(artistId: $id) {
      content(num: 10, offset: 0, categories: ["categories/interviews"]) {
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

export const artistInterviews = (
  data: ArtistInterviewsContentQueryVariables,
): GraphQLOperation<
  ArtistInterviewsContentQueryVariables,
  ArtistInterviewsContentQuery
> => {
  const { id } = data;
  return {
    document: queryDocument,
    variables: {
      id,
    },
  };
};
