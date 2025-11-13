import type { Api } from '../../schemas/api.js';

export const ampMapping: Record<string, Record<string, Api['amp']>> = {
  pr: {
    AU: {
      clientEndpoint: 'https://au.api.iheart.com',
      serverEndpoint: 'https://ampinternalau.ihrprod.net',
    },
    CA: {
      clientEndpoint: 'https://ca.api.iheart.com',
      serverEndpoint: 'https://ampinternalca.ihrprod.net',
    },
    MX: {
      clientEndpoint: 'https://mx.api.iheart.com',
      serverEndpoint: 'https://ampinternalmx.ihrprod.net',
    },
    NZ: {
      clientEndpoint: 'https://nz.api.iheart.com',
      serverEndpoint: 'https://ampinternalnz.ihrprod.net',
    },
    US: {
      clientEndpoint: 'https://us.api.iheart.com',
      serverEndpoint: 'https://ampinternal.ihrprod.net',
    },
    WW: {
      clientEndpoint: 'https://ww.api.iheart.com',
      serverEndpoint: 'https://ww.api.iheart.com',
    },
  },
  production: {
    AU: {
      clientEndpoint: 'https://au.api.iheart.com',
      serverEndpoint: 'https://ampinternalau.ihrprod.net',
    },
    CA: {
      clientEndpoint: 'https://ca.api.iheart.com',
      serverEndpoint: 'https://ampinternalca.ihrprod.net',
    },
    MX: {
      clientEndpoint: 'https://mx.api.iheart.com',
      serverEndpoint: 'https://ampinternalmx.ihrprod.net',
    },
    NZ: {
      clientEndpoint: 'https://nz.api.iheart.com',
      serverEndpoint: 'https://ampinternalnz.ihrprod.net',
    },
    US: {
      clientEndpoint: 'https://us.api.iheart.com',
      serverEndpoint: 'https://ampinternal.ihrprod.net',
    },
    WW: {
      clientEndpoint: 'https://ww.api.iheart.com',
      serverEndpoint: 'https://ww.api.iheart.com',
    },
  },
  staging: {
    AU: {
      clientEndpoint: 'https://au.api.iheart.com',
      serverEndpoint: 'https://ampinternalau.ihrprod.net',
    },
    CA: {
      clientEndpoint: 'https://ca.api.iheart.com',
      serverEndpoint: 'https://ampinternalca.ihrprod.net',
    },
    MX: {
      clientEndpoint: 'https://mx.api.iheart.com',
      serverEndpoint: 'https://ampinternalmx.ihrprod.net',
    },
    NZ: {
      clientEndpoint: 'https://nz.api.iheart.com',
      serverEndpoint: 'https://ampinternalnz.ihrprod.net',
    },
    US: {
      clientEndpoint: 'https://us.api.iheart.com',
      serverEndpoint: 'https://ampinternal.ihrprod.net',
    },
    WW: {
      clientEndpoint: 'https://ww.api.iheart.com',
      serverEndpoint: 'https://ww.api.iheart.com',
    },
  },
};
