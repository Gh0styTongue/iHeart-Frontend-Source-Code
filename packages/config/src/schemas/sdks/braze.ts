import { z } from 'zod';
/*
 Schema based on Braze initialization requirements and legacy implementation. 
 - Reference: https://www.braze.com/docs/developer_guide/platform_integration_guides/web/initial_sdk_setup/?tab=before%20initialization#ssr
 */
export const brazeSchema = z.object({
  apiKey: z.string(),
  allowUserSuppliedJavascript: z.boolean().optional(),
  appVersion: z.string().optional(),
  baseUrl: z.string(),
  enableLogging: z.boolean(),
  manageServiceWorkerExternally: z.boolean().optional(),
  minimumIntervalBetweenTriggerActionsInSeconds: z.number().optional(),
  sessionTimeoutInSeconds: z.number().optional(),
  serviceWorkerLocation: z.string().optional(),
});

export type BrazeSchema = z.infer<typeof brazeSchema>;
