import { gql } from 'graphql-request';

import type {
  TrendingQuery,
  TrendingQueryVariables,
} from '../../../generated/webapi-types.js';
import type { GraphQLOperation } from '../../client.js';

const queryDocument = gql`
  query Trending($tags: [String!]!) {
    pubsub {
      query(
        type: "content:trending"
        query: { limit: 1, subscription: [{ tags: $tags }] }
      ) {
        items {
          content {
            __typename
            ... on PubsubContentTrendingPayloadSelection {
              data {
                trending {
                  image {
                    public_uri
                  }
                  title
                  link
                  mobile_link
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const trending = (
  data: TrendingQueryVariables,
): GraphQLOperation<TrendingQueryVariables, TrendingQuery> => {
  const { tags } = data;
  return {
    document: queryDocument,
    variables: {
      tags,
    },
  };
};
