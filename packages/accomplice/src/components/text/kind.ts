import type { ElementType } from 'react';

import { vars } from '../../theme-contract.css.js';

export const kinds = {
  h1: {
    fontSize: vars.fontSize[40],
    fontWeight: '700',
    letterSpacing: vars.letterSpacing[3],
    lineHeight: vars.lineHeight[48],
  },
  h2: {
    fontSize: vars.fontSize[32],
    fontWeight: '700',
    letterSpacing: vars.letterSpacing[6],
    lineHeight: vars.lineHeight[40],
  },
  h3: {
    fontSize: vars.fontSize[24],
    fontWeight: '700',
    letterSpacing: vars.letterSpacing[1],
    lineHeight: vars.lineHeight[30],
  },
  h4: {
    fontSize: vars.fontSize[20],
    fontWeight: '700',
    letterSpacing: vars.letterSpacing[1],
    lineHeight: vars.lineHeight[24],
  },
  h5: {
    fontSize: vars.fontSize[18],
    fontWeight: '700',
    letterSpacing: vars.letterSpacing[4],
    lineHeight: vars.lineHeight[24],
  },
  'subtitle-1': {
    fontSize: vars.fontSize[17],
    fontWeight: '600',
    letterSpacing: vars.letterSpacing[0],
    lineHeight: vars.lineHeight[24],
  },
  'subtitle-2': {
    fontSize: vars.fontSize[16],
    fontWeight: '600',
    letterSpacing: vars.letterSpacing[0],
    lineHeight: vars.lineHeight[24],
  },
  'subtitle-3': {
    fontSize: vars.fontSize[15],
    fontWeight: '600',
    letterSpacing: vars.letterSpacing[0],
    lineHeight: vars.lineHeight[20],
  },
  'subtitle-4': {
    fontSize: vars.fontSize[14],
    fontWeight: '600',
    letterSpacing: vars.letterSpacing[0],
    lineHeight: vars.lineHeight[18],
  },
  'subtitle-5': {
    fontSize: vars.fontSize[13],
    fontWeight: '600',
    letterSpacing: vars.letterSpacing[0],
    lineHeight: vars.lineHeight[16],
  },
  'body-1': {
    fontSize: vars.fontSize[21],
    fontWeight: '400',
    letterSpacing: vars.letterSpacing[1],
    lineHeight: vars.lineHeight[28],
  },
  'body-2': {
    fontSize: vars.fontSize[18],
    fontWeight: '400',
    letterSpacing: vars.letterSpacing[1],
    lineHeight: vars.lineHeight[24],
  },
  'body-3': {
    fontSize: vars.fontSize[16],
    fontWeight: '400',
    letterSpacing: vars.letterSpacing[1],
    lineHeight: vars.lineHeight[24],
  },
  'body-4': {
    fontSize: vars.fontSize[14],
    fontWeight: '400',
    letterSpacing: vars.letterSpacing[1],
    lineHeight: vars.lineHeight[18],
  },
  'button-1': {
    fontSize: vars.fontSize[16],
    fontWeight: '600',
    letterSpacing: vars.letterSpacing[0],
    lineHeight: vars.lineHeight[24],
  },
  'button-2': {
    fontSize: vars.fontSize[14],
    fontWeight: '600',
    letterSpacing: vars.letterSpacing[0],
    lineHeight: vars.lineHeight[16],
  },
  'caption-1': {
    fontSize: vars.fontSize[14],
    fontWeight: '600',
    letterSpacing: vars.letterSpacing[0],
    lineHeight: vars.lineHeight[18],
  },
  'caption-2': {
    fontSize: vars.fontSize[14],
    fontWeight: '400',
    letterSpacing: vars.letterSpacing[0],
    lineHeight: vars.lineHeight[18],
  },
  'caption-3': {
    fontSize: vars.fontSize[12],
    fontWeight: '600',
    letterSpacing: vars.letterSpacing[0],
    lineHeight: vars.lineHeight[16],
  },
  'caption-4': {
    fontSize: vars.fontSize[12],
    fontWeight: '400',
    lineHeight: vars.lineHeight[16],
    letterSpacing: vars.letterSpacing[4],
  },
  'overline-1': {
    fontSize: vars.fontSize[11],
    fontWeight: '700',
    letterSpacing: vars.letterSpacing[5],
    lineHeight: vars.lineHeight[16],
    textTransform: 'uppercase',
  },
  'overline-2': {
    fontSize: vars.fontSize[10],
    fontWeight: '400',
    letterSpacing: vars.letterSpacing[4],
    lineHeight: vars.lineHeight[14],
  },
  'overline-3': {
    fontSize: vars.fontSize[6],
    fontWeight: '600',
    letterSpacing: vars.letterSpacing[4],
    lineHeight: vars.lineHeight[8],
  },
  'pre-1': {
    fontSize: vars.fontSize[18],
  },
  'pre-2': {
    fontSize: vars.fontSize[16],
  },
  'pre-3': {
    fontSize: vars.fontSize[12],
  },
  lyrics: {
    fontSize: vars.fontSize[24],
    fontWeight: '700',
    letterSpacing: vars.letterSpacing[1],
    lineHeight: vars.lineHeight[30],
    paddingBottom: vars.space[18],
    userSelect: 'none',
  },
} as const;

export const kindToElementMapping = {
  'body-1': 'p',
  'body-2': 'p',
  'body-3': 'p',
  'body-4': 'p',
  'button-1': 'button',
  'button-2': 'button',
  'caption-1': 'span',
  'caption-2': 'span',
  'caption-3': 'span',
  'caption-4': 'span',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  'overline-1': 'span',
  'overline-2': 'span',
  'overline-3': 'span',
  'pre-1': 'pre',
  'pre-2': 'pre',
  'pre-3': 'pre',
  'subtitle-1': 'p',
  'subtitle-2': 'p',
  'subtitle-3': 'p',
  'subtitle-4': 'p',
  'subtitle-5': 'p',
  lyrics: 'p',
} as const satisfies {
  [key in keyof typeof kinds]: ElementType;
};

export type Kind = keyof typeof kinds;

export const allowedElements = [
  'div',
  'p',
  'button',
  'span',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'pre',
  'li',
] as const satisfies ElementType[];
