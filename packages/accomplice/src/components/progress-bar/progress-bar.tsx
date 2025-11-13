import type { CSSProperties } from 'react';
import {
  type ProgressBarProps as RACProgressBarProps,
  Label,
  ProgressBar as RACProgressBar,
} from 'react-aria-components';

import { sprinkles } from '../../sprinkles.css.js';
import { fieldLabelClassname } from '../field/field.js';
import {
  progressBarFillStyles,
  progressBarStyles,
} from './progress-bar.css.js';

export interface ProgressBarProps extends RACProgressBarProps {
  label?: string;
  showValue?: boolean;
  style?: CSSProperties;
}

export function ProgressBar({
  label,
  showValue,
  style,
  ...props
}: ProgressBarProps) {
  return (
    <RACProgressBar {...props}>
      {({ percentage, valueText }) => (
        <div
          className={sprinkles({
            display: 'flex',
            flexDirection: 'column',
            gap: '4',
            width: 'full',
          })}
          style={style}
        >
          {label ?
            <Label className={fieldLabelClassname}>{label}</Label>
          : null}
          {showValue ?
            <span className="value">{valueText}</span>
          : null}
          <div className={progressBarStyles}>
            <div
              className={progressBarFillStyles}
              style={{ width: percentage + '%' }}
            />
          </div>
        </div>
      )}
    </RACProgressBar>
  );
}
