import { gql } from 'graphql-request';

import type {
  Query,
  StreamsStreamByIdInput,
} from '../../../generated/webapi-types.js';
import type { GraphQLOperation } from '../../client.js';

const queryDocument = gql`
  query RecentlyPlayedEnabled($id: Int!) {
    streamsV2 {
      streams {
        byId(input: { id: $id }) {
          recently_played_enabled
        }
      }
    }
  }
`;
export type StreamsV2StreamsOutput = Pick<Query, 'streamsV2'>;

export const recentlyPlayedEnabled = (
  data: StreamsStreamByIdInput,
): GraphQLOperation<StreamsStreamByIdInput, StreamsV2StreamsOutput> => ({
  document: queryDocument,
  variables: {
    id: data.id,
  },
});
