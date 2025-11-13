import { z } from 'zod';

import { amazonSchema } from './amazon.js';
import { appBoySchema } from './app-boy.js';
import { appsFlyerSchema } from './appsflyer.js';
import { brazeSchema } from './braze.js';
import { comScoreSchema } from './com-score.js';
import { facebookSchema } from './facebook.js';
import { gFKSensicSchema } from './gfk-sensic.js';
import {
  googleAnalyticsSchema,
  googleCastSchema,
  googleFirebaseSchema,
  googlePlusSchema,
  googleRecaptchaSchema,
} from './google.js';
import { iasSchema } from './ias.js';
import { indexExhangeSchema } from './index-exchange.js';
import { jwPlayerSchema } from './jw-player.js';
import { kruxSchema } from './krux.js';
import { liverampSchema } from './live-ramp.js';
import { lotameSchema } from './lotame.js';
import { moatSchema } from './moat.js';
import { outbrainSchema } from './outbrain.js';
import { permutiveSchema } from './permutive.js';
import { recurlySchema } from './recurly.js';
import { rubiconSchema } from './rubicon.js';
import { simpleReachSchema } from './simple-reach.js';
import { snapchatSchema } from './snapchat.js';
import { tritonSchema } from './triton.js';

export const sdksSchema = z.object({
  amazon: amazonSchema.optional(),
  appBoy: appBoySchema.optional(),
  appsFlyer: appsFlyerSchema.optional(),
  braze: brazeSchema.optional(),
  comScore: comScoreSchema.optional(),
  facebook: facebookSchema.optional(),
  gfkSensicSdk: gFKSensicSchema.optional(),
  googleAnalytics: googleAnalyticsSchema.optional(),
  googleCast: googleCastSchema.optional(),
  googleFirebase: googleFirebaseSchema.optional(),
  googlePlus: googlePlusSchema.optional(),
  googleRecaptcha: googleRecaptchaSchema,
  ias: iasSchema.optional(),
  indexExchange: indexExhangeSchema.optional(),
  jwPlayer: jwPlayerSchema.optional(),
  krux: kruxSchema.optional(),
  liveramp: liverampSchema.optional(),
  lotame: lotameSchema.optional(),
  moat: moatSchema.optional(),
  outbrain: outbrainSchema.optional(),
  permutive: permutiveSchema.optional(),
  recurly: recurlySchema.optional(),
  rubicon: rubiconSchema.optional(),
  simpleReach: simpleReachSchema.optional(),
  snapchat: snapchatSchema.optional(),
  triton: tritonSchema.optional(),
});

export type Sdks = z.infer<typeof sdksSchema>;
