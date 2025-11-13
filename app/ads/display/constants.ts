export const CCRPOS = {
  Hero: '2013',
  LeftNav: '2000',
  Inline: '2014',
} as const;

export type AdPosition = (typeof CCRPOS)[keyof typeof CCRPOS];
