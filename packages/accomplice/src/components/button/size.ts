import { vars } from '../../theme-contract.css.js';
import { kinds } from '../text/kind.js';

export const sizes = {
  icon: {
    padding: vars.space[4],
    aspectRatio: '1 / 1',
    borderRadius: vars.radius[999],
  },
  large: {
    ...kinds['button-1'],

    height: vars.space[48],
    padding: `${vars.space[12]} ${vars.space[24]}`,
  },
  small: {
    ...kinds['button-2'],

    height: vars.space[32],
    padding: `${vars.space[8]} ${vars.space[16]}`,
  },
};

export type Size = keyof typeof sizes;
