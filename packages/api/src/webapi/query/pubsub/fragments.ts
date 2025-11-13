import { gql } from 'graphql-request';

export const PublishRecordFragment = gql`
  fragment PublishRecord on PubsubPublishRecord {
    summary {
      title
      image
      description
    }
    payload
  }
`;
