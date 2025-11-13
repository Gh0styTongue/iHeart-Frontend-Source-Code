import type { CTAItemData } from '../types/cta-props.js';

export const primaryHome: CTAItemData = {
  block: 'action',
  props: { color: 'red', kind: 'primary', path: '/', text: 'Return home' },
};

export const primaryReload: CTAItemData = {
  block: 'reload',
  props: { color: 'red', kind: 'primary', path: '', text: '' },
};

export const secondaryHome: CTAItemData = {
  block: 'action',
  props: {
    color: 'default',
    kind: 'secondary',
    path: '/',
    text: 'Return home',
  },
};

export const secondaryLogin: CTAItemData = {
  block: 'action',
  props: {
    color: 'default',
    kind: 'secondary',
    path: '/login',
    text: 'Log in',
  },
};

export const tertiaryClear: CTAItemData = {
  block: 'clear',
  props: {
    color: 'default',
    kind: 'tertiary',
    path: '',
    text: '',
  },
};
