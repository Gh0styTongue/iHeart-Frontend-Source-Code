import { clsx } from 'clsx/lite';
import type { ReactNode } from 'react';
import {
  type TooltipProps as TooltipProps_,
  type TooltipTriggerComponentProps as TooltipTriggerComponentProps_,
  OverlayArrow,
  Tooltip as Tooltip_,
  TooltipTrigger,
} from 'react-aria-components';
import type { Simplify } from 'type-fest';

import { overlayArrowStyles, tooltipStyles } from './tooltip.css.js';

export type TriggerProps = Omit<TooltipTriggerComponentProps_, 'children'>;

export type TooltipProps = Simplify<
  Omit<TooltipProps_, 'children'> & {
    children: ReactNode;
  }
>;

function Tooltip({ children, className, ...props }: TooltipProps) {
  return (
    <Tooltip_
      className={clsx(tooltipStyles, className)}
      data-test="tooltip"
      offset={props.offset ?? 4}
      {...props}
    >
      <OverlayArrow>
        <svg className={overlayArrowStyles} height={8}>
          <path d="M0 0 L8 8 L16 0" />
        </svg>
      </OverlayArrow>
      {children}
    </Tooltip_>
  );
}

export { Tooltip, TooltipTrigger };
