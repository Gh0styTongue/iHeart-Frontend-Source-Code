import { gql } from 'graphql-request';

import type {
  PodcastTranscriptionQuery,
  PodcastTranscriptionQueryVariables,
} from '../../../generated/webapi-types.js';
import type { GraphQLOperation } from '../../index.js';

const queryDocument = gql`
  query PodcastTranscription($episodeId: Int!) {
    podcastTranscriptionFormatter {
      format(
        episodeId: $episodeId
        options: {
          outputFormat: HTML
          stripNewlines: true
          collapseSpeakers: true
          includeTimes: true
          collapseTimes: true
          timeCollapseThreshold: 20
        }
      )
    }
  }
`;

export const podcastTranscription = ({
  episodeId,
}: {
  episodeId: number;
}): GraphQLOperation<
  PodcastTranscriptionQueryVariables,
  PodcastTranscriptionQuery
> => {
  return {
    document: queryDocument,
    variables: {
      episodeId,
    },
  };
};
