import { initContract } from '@ts-rest/core';
import type { Merge, SetOptional } from 'type-fest';

import { ContentType, HttpMethods } from '../../../httpUtils/constants.js';
import type { V3 } from '../../../types/poweramp.js';

const c = initContract();

export type GetRecurlyStatusResponseBody = Merge<
  V3.GetRecurlyStatus.ResponseBody,
  {
    subscription?: Merge<
      SetOptional<V3.GetRecurlyStatus.ResponseBody['subscription'], 'uuid'>,
      { state: string }
    >;
  }
>;

export const recurlyContract = c.router(
  {
    getRecurlyStatus: {
      method: HttpMethods.Get,
      path: '/status',
      responses: {
        200: c.type<GetRecurlyStatusResponseBody>(),
      },
    },

    getRecurlyBillingInfo: {
      method: HttpMethods.Get,
      path: '/billingInfo',
      responses: {
        200: c.type<Partial<V3.GetRecurlyBillingInfo.ResponseBody>>(),
      },
    },

    deleteRecurlyBillingInfo: {
      method: HttpMethods.Delete,
      path: '/billingInfo',
      body: c.type<V3.DeleteRecurlyBillingInfo.RequestBody>(),
      responses: {
        204: c.type<V3.DeleteRecurlyBillingInfo.ResponseBody>(),
      },
    },

    putRecurlyBillingInfo: {
      method: HttpMethods.Put,
      path: '/billingInfo',
      body: c.type<V3.PutRecurlyBillingInfo.RequestBody>(),
      responses: {
        204: c.type<V3.PutRecurlyBillingInfo.ResponseBody>(),
      },
    },

    updateRecurlyAutoRenew: {
      method: HttpMethods.Put,
      path: '/autoRenew',
      body: c.type<V3.UpdateRecurlyAutoRenew.RequestBody>(),
      responses: {
        204: c.type<V3.UpdateRecurlyAutoRenew.ResponseBody>(),
      },
    },

    getRecurlyInvoices: {
      method: HttpMethods.Get,
      path: '/invoices',
      responses: {
        200: c.type<V3.GetRecurlyInvoices.ResponseBody>(),
      },
    },

    getRecurlyPlans: {
      method: HttpMethods.Get,
      path: '/plans',
      responses: {
        200: c.type<V3.GetRecurlyPlans.ResponseBody>(),
      },
    },

    postRecurlyPurchase: {
      method: HttpMethods.Post,
      path: '/purchase',
      contentType: ContentType.Json,
      body: c.type<V3.PostRecurlyPurchase.RequestBody>(),
      responses: {
        204: c.type<never>(),
      },
    },

    postRecurlyPurchasePreview: {
      method: HttpMethods.Post,
      path: '/purchase/preview',
      contentType: ContentType.Json,
      body: c.type<V3.PostRecurlyPurchasePreview.RequestBody>(),
      responses: {
        200: c.type<V3.PostRecurlyPurchasePreview.ResponseBody>(),
      },
    },
  },
  {
    pathPrefix: '/external/recurly',
  },
);
