import type { ComScore } from '../../../schemas/sdks/com-score.js';

export const stagingWW: ComScore = {
  customerId: '6036262',
  enabled: true,
  publisherSecret: '0bef577ec3f4eebf3d5eaa3945b5f838',
  threshold: 100,
};

export const productionWW: ComScore = {
  ...stagingWW,
};
