import { assignInlineVars } from '@vanilla-extract/dynamic';
import { mergeProps } from 'react-aria';
import type { Simplify } from 'type-fest';

import { Icon } from '../components/icon/icon.js';
import type { ElementProps } from '../types.js';
import { circleStyle, strokeVar } from './loading.css.js';

export type LoadingProps = Simplify<
  Omit<ElementProps<typeof Icon>, 'children'>
>;

export function Loading({ strokeWidth = 2, stroke, ...props }: LoadingProps) {
  const mergedProps = mergeProps({ style: { stroke, strokeWidth } }, props);

  return (
    <Icon aria-label="Loading" fill="none" {...mergedProps}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle
          className={circleStyle}
          cx="50"
          cy="50"
          fill="transparent"
          r="47"
          style={assignInlineVars({ [strokeVar]: stroke })}
        />
      </svg>
    </Icon>
  );
}
