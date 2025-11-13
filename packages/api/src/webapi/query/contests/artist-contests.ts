import { gql } from 'graphql-request';

import type {
  Query,
  // QueryArtistArgs,
} from '../../../generated/webapi-types.js';
import type { GraphQLOperation } from '../../client.js';

const queryDocument = gql`
  query GetArtistStationContests($artistId: String!) {
    aptivada(accountId: "") {
      campaigns(tag: $artistId) {
        accountName
        appId
        gridImage
        gridRedirect
        idExternal
        pageUrl
        scheduleStatus
        title
      }
    }
  }
`;

export const artistContests = ({
  artistId,
}: {
  // this should be a number, but the query given to us only accepts a string. Should use QueryArtistArgs
  artistId: string;
}): GraphQLOperation<
  {
    artistId: string;
  },
  Pick<Query, 'aptivada'>
> => ({
  document: queryDocument,
  variables: {
    artistId,
  },
});
