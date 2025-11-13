import { type Ref, forwardRef, useEffect, useState } from 'react';
import type * as RAC from 'react-aria-components';
import { Label, Slider as Slider_, SliderOutput } from 'react-aria-components';
import { isNumber } from 'remeda';

import {
  type SliderThumbVariants,
  type SliderVariants,
  sliderLabelStyles,
  sliderOutputStyles,
  sliderRootStyles,
  sliderThumbStyles,
} from './slider.css.js';
import { SliderThumb } from './slider-thumb.js';
import { SliderTrack } from './slider-track.js';

export type SliderProps = RAC.SliderProps<number> &
  SliderVariants &
  SliderThumbVariants & {
    label?: string | undefined;
    name?: string | undefined;
    debug?: boolean | undefined;
    showOutput?: boolean | undefined;
  };

function Slider(
  {
    label,
    interactive = true,
    onlyThumbOnHover,
    debug,
    showOutput,
    onChange,
    onChangeEnd,
    defaultValue,
    value: _value,
    ...props
  }: SliderProps,
  ref: Ref<HTMLDivElement>,
) {
  const [internalValue, setInternalValue] = useState(_value ?? defaultValue);
  const [previewValue, setPreviewValue] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging && isNumber(_value)) {
      setInternalValue(_value);
    }
  }, [_value, isDragging]);

  return (
    <>
      <Slider_
        className={sliderRootStyles({ interactive })}
        {...props}
        onChange={value => {
          setInternalValue(value);
          onChange?.(value);
        }}
        onChangeEnd={value => {
          setInternalValue(value);
          // This is only called "onChangeEnd" to avoid thrashing the onChange function with updates while the user is dragging the slider.
          onChangeEnd?.(value);
          setPreviewValue(null);
        }}
        ref={ref}
        value={internalValue}
      >
        {label ?
          <Label className={sliderLabelStyles}>{label}</Label>
        : null}
        <SliderTrack
          interactive={interactive}
          onPreviewChange={setPreviewValue}
          previewValue={isDragging ? (_value ?? internalValue) : previewValue}
          setIsDragging={setIsDragging}
        >
          {interactive ?
            <SliderThumb className={sliderThumbStyles({ onlyThumbOnHover })} />
          : null}
        </SliderTrack>
        {showOutput ?
          <SliderOutput className={sliderOutputStyles} />
        : null}
      </Slider_>
      {debug ?
        <div style={{ position: 'absolute', transform: 'translateY(50px)' }}>
          {previewValue}
        </div>
      : null}
    </>
  );
}

const _Slider = forwardRef(Slider);
export { _Slider as Slider };
