import type * as RAC from 'react-aria-components';
import { SliderThumb as SliderThumb_ } from 'react-aria-components';

import { type SliderThumbVariants, sliderThumbStyles } from './slider.css.js';

export type SliderThumbProps = RAC.SliderThumbProps & SliderThumbVariants;

export function SliderThumb({ onlyThumbOnHover, ...props }: SliderThumbProps) {
  return (
    <SliderThumb_
      {...props}
      className={sliderThumbStyles({ onlyThumbOnHover })}
      data-test="slider-thumb"
    />
  );
}
