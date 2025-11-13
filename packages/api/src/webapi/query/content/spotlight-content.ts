import { gql } from 'graphql-request';

import type {
  SpotlightCarouselsQuery,
  SpotlightCarouselsQueryVariables,
} from '../../../generated/webapi-types.js';
import type { GraphQLOperation } from '../../client.js';

const queryDocument = gql`
  query SpotlightCarousels($id: ID!) {
    carousels {
      __typename
      byId(id: $id) {
        __typename
        id
        titleColor
        subtitleColor
        metadata {
          __typename
          title
          subtitle
          description
          image
          locales
          mobileUrl
          webUrl
        }
        catalogItems {
          __typename
          id
          record {
            __typename
            ... on CatalogRecordCommonFields {
              id
              name
              kind
              img
              device_link
            }
            ... on CatalogStation {
              description
            }
            ... on CatalogAlbum {
              amp {
                artistId
              }
            }
            ... on CatalogTrack {
              amp {
                artistId
                albumId
              }
            }
          }
        }
        linkedCarousels {
          __typename
          id
          titleColor
          subtitleColor
          metadata {
            __typename
            title
            subtitle
            description
            image
            locales
            mobileUrl
            webUrl
          }
          catalogItems {
            __typename
            id
            record {
              __typename
              ... on CatalogRecordCommonFields {
                id
                name
                kind
                img
                device_link
              }
              ... on CatalogStation {
                description
              }
              ... on CatalogAlbum {
                amp {
                  artistId
                }
              }
              ... on CatalogTrack {
                amp {
                  artistId
                  albumId
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const spotlightContent = (
  data: SpotlightCarouselsQueryVariables,
): GraphQLOperation<
  SpotlightCarouselsQueryVariables,
  SpotlightCarouselsQuery
> => {
  const { id } = data;
  return {
    document: queryDocument,
    variables: {
      id,
    },
  };
};
