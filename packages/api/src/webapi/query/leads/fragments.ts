import { gql } from 'graphql-request';

export const CardFragment = gql`
  fragment commonCardFields on Card {
    catalog {
      id
    }
    id
    img_uri
    link {
      urls {
        web
        device
      }
    }
    subtitle
    title
  }
`;
