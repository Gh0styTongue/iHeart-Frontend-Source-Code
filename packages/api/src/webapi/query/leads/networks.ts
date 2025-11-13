import { gql } from 'graphql-request';

import type {
  PodcastNetworksQuery,
  PodcastNetworksQueryVariables,
} from '../../../generated/webapi-types.js';
import type { GraphQLOperation } from '../../client.js';
import { Collections } from './constants.js';

type NetworksRequestData = {
  countryCode: string;
  locale: string;
  limit?: number;
};

const queryDocument = gql`
  query PodcastNetworks($query: QueryInput!, $locale: String) {
    podcast_networks: leads(query: $query, locale: $locale) {
      title
      img_uri
      link {
        urls {
          web
          device
        }
      }
    }
  }
`;

export const podcastNetworks = (
  data: NetworksRequestData,
): GraphQLOperation<PodcastNetworksQueryVariables, PodcastNetworksQuery> => {
  const { countryCode, locale, limit } = data;

  return {
    document: queryDocument,
    variables: {
      locale,
      query: {
        limit,
        subscription: [
          {
            tags: [Collections.PodcastNetworks, `countries/${countryCode}`],
          },
        ],
      },
    },
  };
};
