import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import { HttpMethods } from '../../../httpUtils/constants.js';
import type { V3 } from '../../../types/poweramp.js';
import { implement } from '../../implement.js';
import { subscriptionTypeSchema } from '../../schemas/common.js';
import { recurlyContract } from './recurly.js';

const c = initContract();

type GetFamilyPlanMembersRequestQuery = V3.GetFamilyPlanMembers.RequestQuery & {
  familyPlanId?: string;
};

export const subscriptionContract = c.router(
  {
    recurly: recurlyContract,

    getSubscriptionStatus: {
      method: HttpMethods.Get,
      path: '/status',
      responses: {
        // 200: c.type<V3.GetStatus2.ResponseBody>(),
        200: implement<V3.GetStatus2.ResponseBody>().from({
          entitlements: z.array(z.string()),
          subscription: z.object({
            expiry: z.number().optional(),
            hasNapsterBillingHistory: z.boolean(),
            isAutoRenewing: z.boolean(),
            isEligibleForAnotherTrial: z.boolean(),
            isFamilyPlanParent: z.boolean().optional(),
            isOnHold: z.boolean().optional(),
            isTrial: z.boolean(),
            isTrialEligible: z.boolean(),
            lastModified: z.number().optional(),
            lastTrialExpirationDate: z.number().optional(),
            productId: z.string().optional(),
            promosRedeemed: z.array(z.string()),
            source: z.string().optional(),
            terminationDate: z.number().optional(),
            type: subscriptionTypeSchema,
          }),
        }),
      },
    },

    postFamilyPlanAcceptInvitation: {
      method: HttpMethods.Post,
      path: '/external/familyPlan/acceptInvitation',
      query: c.type<V3.PostFamilyPlanAcceptInvitation.RequestQuery>(),
      body: c.type<V3.PostFamilyPlanAcceptInvitation.RequestBody>(),
      responses: {
        200: c.type<V3.PostFamilyPlanAcceptInvitation.ResponseBody>(),
      },
    },

    getFamilyPlanMembers: {
      method: HttpMethods.Get,
      path: '/external/familyPlan/members',
      query: c.type<GetFamilyPlanMembersRequestQuery>(),
      responses: {
        200: c.type<V3.GetFamilyPlanMembers.ResponseBody>(),
      },
    },

    postFamilyPlanMembers: {
      method: HttpMethods.Post,
      path: '/external/familyPlan/members',
      query: c.type<V3.PostFamilyPlanMembers.RequestQuery>(),
      body: c.type<V3.PostFamilyPlanMembers.RequestBody>(),
      responses: {
        200: c.type<V3.PostFamilyPlanMembers.ResponseBody>(),
      },
    },

    deleteFamilyPlanMembers: {
      method: HttpMethods.Delete,
      path: '/external/familyPlan/members',
      query: c.type<V3.DeleteFamilyPlanMembers.RequestQuery>(),
      body: c.type<V3.DeleteFamilyPlanMembers.RequestBody>(),
      responses: {
        204: c.type<V3.DeleteFamilyPlanMembers.ResponseBody>(),
      },
    },

    getFamilyPlanParentInfo: {
      method: HttpMethods.Get,
      path: '/external/familyPlan/parentInfo',
      responses: {
        200: c.type<V3.GetFamilyPlanParentInfo.ResponseBody>(),
      },
    },
  },
  {
    pathPrefix: '/subscription',
  },
);
