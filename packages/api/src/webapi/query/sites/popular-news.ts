import { gql } from 'graphql-request';

import type {
  PopularNewsQuery,
  PopularNewsQueryVariables,
} from '../../../generated/webapi-types.js';
import type { GraphQLOperation } from '../../client.js';
import type { NewsTopic } from './constants.js';

export type PopularNewsRequestData = {
  slug?: string;
  topic?: NewsTopic;
  size?: number;
};

const queryDocument = gql`
  query PopularNews($slug: String!, $feedParams: SitesFeedResumeInput!) {
    sites {
      find(type: SLUG, value: $slug) {
        config: configByLookup(lookup: "site-config-lookups/live") {
          timeline: feed(params: $feedParams) {
            results {
              data
              type
            }
            resume {
              id
              context
              scopes
              size
              from
            }
          }
        }
      }
    }
  }
`;

export const popularNews = (
  data: PopularNewsRequestData,
): GraphQLOperation<PopularNewsQueryVariables, PopularNewsQuery> => {
  const { slug = 'default', topic, size = 12 } = data;

  const feedParams =
    topic ?
      {
        context: { '<topic>': topic },
        id: 'USAGE:feed-usecases/Default Topic',
        size,
      }
    : {
        id: 'USAGE:feed-usecases/Default Content',
        size,
      };

  return {
    document: queryDocument,
    variables: { feedParams, slug },
  };
};
