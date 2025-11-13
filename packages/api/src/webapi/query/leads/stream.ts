import { gql } from 'graphql-request';

import type { StreamInfoQueryVariables } from '../../../generated/webapi-types.js';
import type { GraphQLOperation } from '../../client.js';

export type StreamRequestData = {
  id: number;
};

export type StreamInfoWithTimesQuery = {
  __typename?: 'Query';
  streams?: {
    __typename?: 'StreamsFunctions';
    streams: {
      __typename?: 'Streams';
      byId?: {
        __typename?: 'Stream';
        recentlyPlayedEnabled: boolean;
        amp: {
          __typename?: 'AMPLiveMeta';
          recentlyPlayed: {
            __typename?: 'LiveMetaRecentlyPlayed';
            tracks: Array<{
              __typename?: 'PnpTrackHistory';
              title: string;
              trackId: number;
              startTime: number;
              endTime: number;
              artist?: {
                __typename?: 'Artist';
                artistName: string;
                id: number;
              } | null;
              albumId: number;
              albumName: string;
              trackDuration: number;
              imagePath?: string;
              explicitLyrics: boolean;
              playbackRights: {
                onDemand: boolean;
              };
            }>;
          };
        };
      } | null;
    };
  } | null;
};

const queryDocument = gql`
  query streamInfo($id: Int!) {
    streams {
      streams {
        byId(id: $id) {
          recentlyPlayedEnabled
          amp {
            recentlyPlayed(paging: { take: 20 }) {
              tracks {
                artist {
                  artistName
                  id
                }
                startTime
                endTime
                title
                trackId
                albumId
                albumName
                trackDuration
                imagePath
                explicitLyrics
              }
            }
          }
        }
      }
    }
  }
`;

export const stream = (
  data: StreamRequestData,
): GraphQLOperation<StreamInfoQueryVariables, StreamInfoWithTimesQuery> => {
  const { id } = data;

  return {
    document: queryDocument,
    variables: {
      id,
    },
  };
};
