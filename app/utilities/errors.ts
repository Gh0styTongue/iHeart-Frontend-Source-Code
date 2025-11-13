import type { RegGateContext } from '~app/analytics/data';

import type { AnalyticsLocationType } from './constants';

type MetaType = 'followContext';
type MetaMap = Map<MetaType, AnalyticsLocationType | undefined>;
type ExtractMetaValue<T> = T extends Map<infer _U, infer V> ? V : never;

export class RegGateAnonymousUserError extends Error {
  ctx: RegGateContext;
  meta: MetaMap;

  constructor(ctx: RegGateContext) {
    super('User is anonymous');
    this.ctx = ctx;
    this.meta = new Map();
  }

  addMeta(type: MetaType, meta: ExtractMetaValue<MetaMap>) {
    this.meta.set(type, meta);
  }

  getMeta(type: MetaType) {
    return this.meta.get(type);
  }
}
