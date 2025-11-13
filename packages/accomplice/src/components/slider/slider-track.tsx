import type { Dispatch, ForwardedRef, SetStateAction } from 'react';
import { forwardRef, useContext, useEffect } from 'react';
import { mergeProps, useHover } from 'react-aria';
import type * as RAC from 'react-aria-components';
import {
  SliderStateContext,
  SliderTrackContext,
  useContextProps,
} from 'react-aria-components';
import { round } from 'remeda';

import { useRenderProps } from '../../utilities/rac/use-render-props.js';
import {
  sliderTrackFillStyles,
  sliderTrackPreviewStyles,
  sliderTrackStyles,
} from './slider.css.js';

function getDecimalCount(n: number) {
  if (n === 0) return 0;

  let val = n.toString().split('.')[1]; // Get the segment after the decimal to determine how many places to round to
  while (val.endsWith('0')) val = val.slice(0, -1);
  return String(val).length;
}

function roundToStep(value: number, step: number) {
  return step === 1 ? Math.round(value) : round(value, getDecimalCount(step));
}

const rangeProgressVar = '--range-progress';
const previewWidthVar = '--preview-width';

export interface SliderTrackProps extends RAC.SliderTrackProps {
  interactive?: boolean | undefined;
  previewValue?: number | null;
  onPreviewChange: (n: number | null) => void;
  setIsDragging: Dispatch<SetStateAction<boolean>>;
}

function useSliderStateContext() {
  const state = useContext(SliderStateContext);

  if (!state) {
    throw new Error(
      'SliderStateContext must be used within the proper context provider',
    );
  }

  return state;
}

export const SliderTrack = forwardRef(function SliderTrack(
  props: SliderTrackProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, SliderTrackContext);
  const state = useSliderStateContext();
  const {
    onHoverStart,
    onHoverEnd,
    onHoverChange,
    previewValue,
    onPreviewChange,
    interactive = true,
    setIsDragging,
    ...otherProps
  } = props;
  const { hoverProps, isHovered } = useHover({
    onHoverStart,
    onHoverEnd,
    onHoverChange,
  });

  const { children, ...renderProps } = useRenderProps({
    ...props,
    defaultClassName: sliderTrackStyles,
    values: {
      orientation: state.orientation,
      isDisabled: state.isDisabled,
      isHovered,
      state,
    },
  });

  const sliderTrack = ref.current;

  useEffect(() => {
    setIsDragging(state.isThumbDragging(0));
  }, [setIsDragging, state]);

  return (
    <div
      {...mergeProps(otherProps, hoverProps)}
      {...renderProps}
      data-disabled={state.isDisabled || undefined}
      data-hovered={isHovered || undefined}
      data-orientation={state.orientation || undefined}
      data-test="slider-track"
      onMouseLeave={() => {
        if (interactive && !state.isThumbDragging(0)) {
          onPreviewChange(null);
        }
      }}
      onMouseMove={event => {
        if (!sliderTrack || !interactive) return;

        const bounds = sliderTrack.getBoundingClientRect();

        /**
         * It's possible for the `event.target` here to be either the slider track container or any child of it.
         * So, we calculate the hover preview value based on the event's client-based position data instead of offset-based
         */
        const posX = event.clientX - bounds.left;
        const offset = (posX / bounds.width) * state.getThumbMaxValue(0);
        const newPreviewValue = roundToStep(offset, state.step);

        if (
          !state.isThumbDragging(0) &&
          newPreviewValue > state.getThumbValue(0)
        ) {
          onPreviewChange(newPreviewValue);
        } else {
          onPreviewChange(state.getThumbValue(0));
        }
      }}
      ref={ref}
      style={{
        [rangeProgressVar]: `${state.getThumbPercent(0) * 100}%`,
        [previewWidthVar]:
          previewValue == null || previewValue <= state.getThumbValue(0) ?
            0
          : `${((previewValue - state.getThumbValue(0)) / state.getThumbMaxValue(0)) * 100}%`,
      }}
    >
      <div
        className={sliderTrackFillStyles({ interactive })}
        data-dragging={state.isThumbDragging(0) || undefined}
        data-test="slider-track-fill"
        style={{
          width: `var(${rangeProgressVar})`,
        }}
      />
      {previewValue != null && interactive ?
        <div
          className={sliderTrackPreviewStyles}
          data-dragging={state.isThumbDragging(0) || undefined}
          data-test="slider-track-preview"
          style={{
            left: `var(${rangeProgressVar})`,
            width: `var(${previewWidthVar})`,
          }}
        />
      : null}
      {children}
    </div>
  );
});
