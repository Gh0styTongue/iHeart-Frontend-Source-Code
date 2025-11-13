import { gql } from 'graphql-request';

import type {
  LeadsQuery,
  LeadsQueryVariables,
} from '../../../generated/webapi-types.js';
import type { GraphQLOperation } from '../../client.js';
import { CardFragment } from './fragments.js';

const queryDocument = gql`
  ${CardFragment}

  query Leads($query: QueryInput!, $locale: String) {
    leads(query: $query, locale: $locale) {
      ...commonCardFields
    }
  }
`;

export const leads = (
  data: LeadsQueryVariables,
): GraphQLOperation<LeadsQueryVariables, LeadsQuery> => {
  return {
    document: queryDocument,
    variables: data,
  };
};
