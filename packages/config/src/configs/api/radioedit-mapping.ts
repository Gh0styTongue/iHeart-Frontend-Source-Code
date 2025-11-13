import type { Api } from '../../schemas/api.js';

const baseProduction: Api['radioEdit'] = {
  contentEndpoint: 'https://content.radioedit.iheart.com',
  graphQlEndpoint: 'https://flagshipapi.radioedit.iheart.com/graphql',
  leadsEndpoint: 'https://leads.radioedit.iheart.com',
  webGraphQlEndpoint: 'https://webapi.radioedit.iheart.com/graphql',
  mediaServerEndpoint: 'https://i.iheart.com',
};

// Keeping this here (but commented) in case we ever want to stand up an "always-staging" environment
// const baseNonProduction: Api['radioEdit'] = {
//   contentEndpoint: 'https://content.radioedit.ihrint.com',
//   leadsEndpoint: 'https://leads.radioedit.ihrint.com',
//   graphQlEndpoint: 'https://flagshipapi.radioedit.ihrint.com/graphql',
//   webGraphQlEndpoint: 'https://webapi.radioedit.ihrint.com/graphql',
//   mediaServerEndpoint: 'https://i-stg.iheart.com',
// };

export const radioEditMapping: Record<
  string,
  Record<string, Api['radioEdit']>
> = {
  pr: {
    AU: baseProduction,
    CA: baseProduction,
    MX: baseProduction,
    NZ: baseProduction,
    US: baseProduction,
    WW: baseProduction,
  },
  production: {
    AU: baseProduction,
    CA: baseProduction,
    MX: baseProduction,
    NZ: baseProduction,
    US: baseProduction,
    WW: baseProduction,
  },
  staging: {
    AU: baseProduction,
    CA: baseProduction,
    MX: baseProduction,
    NZ: baseProduction,
    US: baseProduction,
    WW: baseProduction,
  },
};
