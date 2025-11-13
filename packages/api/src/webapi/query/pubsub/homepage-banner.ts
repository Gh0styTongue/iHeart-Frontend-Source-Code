import { gql } from 'graphql-request';

import type {
  LeadsQueryVariables,
  PubsubContentPolarisHomepageBannerPayloadFields,
} from '../../../generated/webapi-types.js';

export interface HomepageBannerData {
  pubsub: {
    query: {
      items: Array<{
        content: {
          data: {
            fields: PubsubContentPolarisHomepageBannerPayloadFields;
          };
        };
      }>;
    };
  };
  emits: string[];
  fields: PubsubContentPolarisHomepageBannerPayloadFields;
}

export interface HomepageBannerOperation {
  document: string;
  variables: LeadsQueryVariables;
}

export const homepageBanner = (
  data: LeadsQueryVariables,
): HomepageBannerOperation => {
  const queryDocument = gql`
    query PolarisHomepageBanner($query: PubsubQueryInput!) {
      pubsub {
        query(type: "content:polaris-homepage-banner", query: $query) {
          items {
            content {
              ... on PubsubContentPolarisHomepageBannerPayloadSelection {
                data {
                  fields {
                    title {
                      value
                    }
                    small_image {
                      value {
                        public_uri
                      }
                    }
                    large_image {
                      value {
                        public_uri
                      }
                    }
                    background_color {
                      value
                    }
                    description {
                      value
                    }
                    link_text {
                      value
                    }
                    link {
                      value
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  return {
    document: queryDocument,
    variables: data,
  };
};
