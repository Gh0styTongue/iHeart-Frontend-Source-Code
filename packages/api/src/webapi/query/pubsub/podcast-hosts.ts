import { gql } from 'graphql-request';

import type { GraphQLOperation } from '../../index.js';
import { PublishRecordFragment } from './fragments.js';

export const podcastHosts = (hostIds: Array<string>): GraphQLOperation => {
  const hostsQuery = hostIds
    .map(
      (hostId, index) => `
        host${index}: get (
          type: "content:author"
          select: { id: "${hostId}" }
        ) {
        ...PublishRecord
      }`,
    )
    .join('');

  const queryDocument = gql`
    query GetPodcastHosts {
      pubsub {
        ${hostsQuery}
      }
    }

    ${PublishRecordFragment}  
  `;

  return {
    document: queryDocument,
    variables: {},
  };
};
