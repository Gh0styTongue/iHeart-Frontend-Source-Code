import { gql } from 'graphql-request';

import type {
  Query,
  QueryAptivadaArgs,
} from '../../../generated/webapi-types.js';
import type { GraphQLOperation } from '../../client.js';

/** documentation for this query can be found here: https://ihm-it.atlassian.net/wiki/spaces/PUBLISHING/pages/507740909/WebAPI+Sites+5x#Contest-Listing
 */

const queryDocument = gql`
  query GetLiveStationContests($accountId: String!) {
    aptivada(accountId: $accountId) {
      apps {
        appId
        appType
        displayImage
        gridImage
        gridRedirect
        gridStatus
        pageUrl
        primaryImage
        prize
        scheduleStatus
        shareTitle
        subtitle
        thumbnailImage
        title
      }
    }
  }
`;

export const liveStationContests = ({
  accountId,
}: {
  accountId: QueryAptivadaArgs['accountId'];
}): GraphQLOperation<QueryAptivadaArgs, Pick<Query, 'aptivada'>> => ({
  document: queryDocument,
  variables: {
    accountId,
  },
});
