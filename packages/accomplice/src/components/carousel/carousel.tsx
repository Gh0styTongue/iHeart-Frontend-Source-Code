import { assignInlineVars } from '@vanilla-extract/dynamic';
import { clsx } from 'clsx/lite';
import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useId } from 'react-aria';
import type { GridListItemProps, GridListProps } from 'react-aria-components';
import { GridList, GridListItem } from 'react-aria-components';
import { isNonNullish } from 'remeda';
import type { SetRequired } from 'type-fest';

import { ChevronLeft } from '../../icons/chevron-left.js';
import { ChevronRight } from '../../icons/chevron-right.js';
import {
  type RainbowSprinkles,
  rainbowSprinkles,
} from '../../rainbow-sprinkles.css.js';
import { sprinkles } from '../../sprinkles.css.js';
import { vars } from '../../theme-contract.css.js';
import type {
  BreakpointObject,
  ElementProps,
  ValueOrBreakpointObject,
} from '../../types.js';
import { getResponsiveVar } from '../../utilities/internal.js';
import { invariant } from '../../utilities/invariant.js';
import { Button } from '../button/index.js';
import {
  carouselButtonContainerStyles,
  carouselHandlerStyles,
  carouselSlidesContainerStyles,
  carouselSlideStyles,
  carouselStyles,
  carouselViewportStyles,
  peekSizeVarMap,
  slideGapVarMap,
  slidesToShowVarMap,
} from './carousel.css.js';

export type CarouselContextProps = {
  api: ReturnType<typeof useEmblaCarousel>[1];
  canScrollNext: boolean;
  canScrollPrev: boolean;
  carouselContainerId: string;
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  scrollNext: () => void;
  scrollPrev: () => void;
  scrollToIndex: (index: number) => void;
} & SetRequired<CarouselProps, 'orientation' | 'slidesToShow'>;

export const CarouselContext = createContext<CarouselContextProps | null>(null);

/**
 * A shared context which makes various pieces of Carousel state available to subcomponents.
 */
export const useCarousel = () => {
  const ctx = useContext(CarouselContext);
  invariant(ctx, 'useCarousel() must be used within a <Carousel />');
  return ctx;
};

const defaultSlidesToShow = {
  default: 3,
  xsmall: 4,
  small: 4,
  shmedium: 5,
  medium: 5,
  large: 6,
  xlarge: 7,
  xxlarge: 8,
} as const;

// These peek sizes DO NOT include the size of the gap between slides
const defaultPeekSizes = {
  default: '4rem',
  xsmall: '4rem',
  small: '4rem',
  shmedium: '5.6rem',
  medium: '5.6rem',
  large: '7.2rem',
  xlarge: '7.2rem',
  xxlarge: '7.2rem',
} as const;

export type PeekSize = BreakpointObject<string>;
export type SlideGap = BreakpointObject<string>;
export type SlidesToShow = BreakpointObject<number>;

export type CarouselProps = ElementProps<'div'> & {
  children?: ReactNode;
  skipSnaps?: boolean;
  isLoading?: boolean;
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  slideGap?: string | SlideGap;
  /** @default 'auto' */
  slidesToScroll?: number;
  /** @default 5 */
  slidesToShow?: Partial<ValueOrBreakpointObject<number>>;
  peekSize?: string | PeekSize;
  /** @default 'start' */
  align?: EmblaOptionsType['align'];
  isEditingCarousel?: EmblaOptionsType['watchDrag'];
  wheelGestures?: boolean;
};

/**
 * Escapes CSS selectors that are created by React so that they are valid.
 * @param s
 * @returns
 */
function cssEscape(s: string) {
  return s.replaceAll(':', '\\:');
}

/**
 * The `Carousel` component shows a collection of items. The items are easily navigable with buttons, scrolling, or dragging.
 *
 * > This Carousel implementation uses <a href="https://www.embla-carousel.com/" target="_blank">Embla Carousel</a> under the hood. View those docs for more information and examples.
 * >
 * > Carousel Accessibility Best Practices: https://www.w3.org/TR/wai-aria-practices/#carousel
 */
export function Carousel({
  children,
  isEditingCarousel = false,
  isLoading,
  orientation = 'horizontal',
  peekSize = defaultPeekSizes,
  slideGap = vars.space[16],
  slidesToScroll,
  slidesToShow = defaultSlidesToShow,
  wheelGestures = true,
  skipSnaps = true,
  ref,
  ...props
}: CarouselProps) {
  const carouselContainerId = useId();

  const watchDrag = useCallback(() => !isEditingCarousel, [isEditingCarousel]);

  const [carouselRef, api] = useEmblaCarousel(
    {
      align: 'start',
      /**
       * This is how we tell the Embla Carousel API which element is the "scrollable" container of
       * the carousel. This also has `ref` support but we MUST use a selector here because we can't
       * target the element we need with a ref.
       *
       * Embla uses the first child of the container ref we provide. The `GridList` component
       * (where we would like to attach the ref) has multiple children and the scrollable container
       * is not the first child. So, the reason we MUST use a selector here is because we don't
       * have a direct reference to the element we need. Passing an ID to the `GridList` and an
       * associated selector to `useEmblaCarousel` gives us the needed behavior.
       */
      container: '#' + cssEscape(carouselContainerId),
      inViewThreshold: 1,
      axis: orientation === 'horizontal' ? 'x' : 'y',
      slidesToScroll: slidesToScroll ?? 'auto',
      dragThreshold: 10,
      watchDrag: watchDrag(),
      skipSnaps,
      // There is an issue where the carousel scroll position resets when attempting to drag and drop an item
      // towards the end of the carousel. Setting `keepSnaps` when the carousel is being edited prevents this issue.
      containScroll: isEditingCarousel ? 'keepSnaps' : 'trimSnaps',
    },
    wheelGestures ? [WheelGesturesPlugin()] : undefined,
  );

  usePreventOverscroll(api);
  useCancelPointerEventsOnScroll(api);

  const { canScrollPrev, canScrollNext, scrollPrev, scrollNext } =
    usePrevNextButtons(api);
  const { scrollToIndex } = useScrollToIndex(api);

  const peekVars = getResponsiveVar(peekSize, peekSizeVarMap);
  const slidesToShowVars = getResponsiveVar(slidesToShow, slidesToShowVarMap);
  const slideGapVars = getResponsiveVar(slideGap, slideGapVarMap);

  const contextValue = useMemo(() => {
    return {
      api,
      canScrollNext,
      canScrollPrev,
      carouselContainerId,
      carouselRef,
      orientation,
      peekSize,
      scrollNext,
      scrollPrev,
      scrollToIndex,
      slidesToShow,
    };
  }, [
    api,
    canScrollNext,
    canScrollPrev,
    carouselContainerId,
    carouselRef,
    orientation,
    peekSize,
    scrollNext,
    scrollPrev,
    scrollToIndex,
    slidesToShow,
  ]);

  return (
    <CarouselContext.Provider value={contextValue}>
      <div
        aria-roledescription="carousel"
        data-loading={isLoading || undefined}
        role="region"
        {...props}
        className={carouselStyles}
        ref={ref}
        style={assignInlineVars({
          ...peekVars,
          ...slideGapVars,
          ...slidesToShowVars,
        })}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

export function CarouselViewport(props: ElementProps<'div'>) {
  return (
    <div
      data-carousel-viewport
      {...props}
      className={clsx(carouselViewportStyles)}
      ref={props.ref}
    />
  );
}

export type CarouselContentProps<T extends object> = GridListProps<T>;

export function CarouselContent<T extends object>({
  items,
  css,
  ...props
}: CarouselContentProps<T> & { css?: RainbowSprinkles }) {
  const { carouselRef, orientation, carouselContainerId } = useCarousel();
  const rs = css ? rainbowSprinkles(css) : undefined;

  if (items && Object.values(items).some(item => !item?.id && item?.id !== 0)) {
    throw new Error(
      'Every item you pass into a "<CarouselContent />" "items" prop must have a key of "id".',
    );
  }

  return (
    <CarouselViewport ref={carouselRef}>
      <GridList
        aria-label="Slides"
        keyboardNavigationBehavior="tab"
        selectionMode="none"
        {...props}
        className={clsx(rs?.className, carouselSlidesContainerStyles)}
        id={carouselContainerId}
        items={items}
        layout={orientation === 'vertical' ? 'stack' : 'grid'}
        style={rs?.style}
      />
    </CarouselViewport>
  );
}

export type CarouselHandlerProps = ElementProps<'div'> & {
  children: ReactNode;
  /** @default true */
  showScrollButtons?: boolean;
};
export function CarouselHandler({
  children,
  showScrollButtons = true,
  ...props
}: CarouselHandlerProps) {
  const { canScrollPrev, canScrollNext, scrollNext, scrollPrev } =
    useCarousel();

  return (
    <div className={carouselHandlerStyles} {...props}>
      <div className={sprinkles({ width: 'full' })}>{children}</div>
      {showScrollButtons ?
        <div className={carouselButtonContainerStyles}>
          <Button
            color="defaultInverted"
            isDisabled={!canScrollPrev}
            kind="primary"
            onPress={scrollPrev}
            size="icon"
          >
            <ChevronLeft />
          </Button>
          <Button
            color="defaultInverted"
            isDisabled={!canScrollNext}
            kind="primary"
            onPress={scrollNext}
            size="icon"
          >
            <ChevronRight />
          </Button>
        </div>
      : null}
    </div>
  );
}

export type CarouselSlideProps<T extends object> = GridListItemProps<T> & {
  'aria-label'?: string | undefined;
};
export function CarouselSlide<T extends object>({
  className,
  ...props
}: CarouselSlideProps<T>) {
  return (
    <GridListItem
      aria-label={props?.['aria-label'] ?? props?.id}
      aria-roledescription="slide"
      className={clsx(carouselSlideStyles, className)}
      textValue={
        props?.['aria-label'] ??
        (props && props?.id ? String(props.id) : 'slide')
      }
      {...props}
    />
  );
}

type UsePrevNextButtonsProps = {
  canScrollPrev: boolean;
  canScrollNext: boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
};

function useScrollToIndex(api: EmblaCarouselType | undefined) {
  const scrollToIndex = useCallback(
    (index: number) => {
      if (!api) return;
      const elementCount = api.slideNodes().length;
      const slidesInView = api.slidesInView();
      const lastSlideInView = slidesInView.at(-1);
      const firstSlideInView = slidesInView.at(0);

      if (slidesInView.includes(index)) {
        return void 0;
      } else if (
        elementCount > 0 &&
        index < elementCount &&
        isNonNullish(lastSlideInView) &&
        isNonNullish(firstSlideInView)
      ) {
        const normalizedPosition = index / elementCount;
        const snapList = api.scrollSnapList();
        let snapIndex = snapList.findIndex((value, index) => {
          if (index === snapList.length - 1) return snapList.at(-1);
          return (
            normalizedPosition >= value &&
            normalizedPosition < snapList[index + 1]
          );
        });

        if (index > lastSlideInView) {
          snapIndex += 1;
        }
        if (index < firstSlideInView) {
          snapIndex -= 1;
        }

        if (snapIndex > -1 && snapIndex <= snapList.length - 1) {
          api.scrollTo(snapIndex);
        } else if (snapIndex === snapList.length) {
          const lastIndex = snapList.at(-1);
          if (lastIndex) {
            api.scrollTo(lastIndex);
          }
        } else {
          api.scrollTo(-0);
        }
      }
    },
    [api],
  );

  return { scrollToIndex };
}

export function useReInit(api: EmblaCarouselType | undefined) {
  const reInit = useCallback(() => {
    if (!api) return;
    api.reInit();
  }, [api]);

  return reInit;
}

/**
 * This hook provides the necessary logic, state, and callbacks for previous and next buttons for an Embla carousel.
 */
function usePrevNextButtons(
  api: EmblaCarouselType | undefined,
): UsePrevNextButtonsProps {
  // Default to `false` since the carousel should be in the left-most position on initial render.
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => {
    if (!api) return;
    api.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    if (!api) return;
    api.scrollNext();
  }, [api]);

  const checkCanScroll = useCallback((emblaApi: EmblaCarouselType) => {
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!api) return;

    checkCanScroll(api);
    api.on('reInit', checkCanScroll);
    api.on('select', checkCanScroll);
    api.on('settle', checkCanScroll);

    return () => {
      api.off('reInit', checkCanScroll);
      api.off('select', checkCanScroll);
      api.off('settle', checkCanScroll);
    };
  }, [api, checkCanScroll]);

  return {
    canScrollPrev,
    canScrollNext,
    scrollPrev,
    scrollNext,
  };
}

/**
 * Prevents an Embla carousel from "overscrolling", meaning the carousel cannot be dragged past the first and last slides.
 */
function usePreventOverscroll(api: EmblaCarouselType | undefined) {
  const onScroll = useCallback((api: EmblaCarouselType) => {
    const {
      limit,
      target,
      location,
      offsetLocation,
      scrollTo,
      translate,
      scrollBody,
    } = api.internalEngine();

    let edge: number | null = null;

    if (location.get() > limit.max) edge = limit.max;
    if (location.get() < limit.min) edge = limit.min;

    if (edge !== null) {
      offsetLocation.set(edge);
      location.set(edge);
      target.set(edge);
      translate.to(edge);
      translate.toggleActive(false);
      // These aren't actually hooks
      // eslint-disable-next-line react-compiler/react-compiler
      scrollBody.useDuration(0).useFriction(0);
      scrollTo.distance(0, false);
    } else {
      translate.toggleActive(true);
    }
  }, []);

  useEffect(() => {
    if (!api) return;

    onScroll(api);
    api.on('scroll', onScroll);

    return () => {
      api.off('scroll', onScroll);
    };
  }, [api, onScroll]);
}

/**
 * Cancels any in-flight press events when initializing carousel drag.
 * This is important to prevent carousel children from executing press event logic when dragging the carousel.
 * @link https://github.com/adobe/react-spectrum/blob/3a8420c64aab8630ee9b06986f03dc13967f3133/packages/react-aria-components/docs/examples/ios-list.mdx?plain=1#L253
 */
function useCancelPointerEventsOnScroll(api: EmblaCarouselType | undefined) {
  const [isDragging, setIsDragging] = useState(false);
  const [pointerCancelled, setPointerCancelled] = useState(false);

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
    setPointerCancelled(false);
  }, []);

  const onPointerDown = useCallback(() => {
    setIsDragging(true);
    setPointerCancelled(false);
  }, []);

  const onScroll = useCallback(() => {
    if (isDragging && !pointerCancelled) {
      document.dispatchEvent(new PointerEvent('pointercancel'));
      setPointerCancelled(true);
    }
  }, [isDragging, pointerCancelled]);

  useEffect(() => {
    if (!api) return;

    api.on('scroll', onScroll);
    api.on('pointerUp', onPointerUp);
    api.on('pointerDown', onPointerDown);

    return () => {
      api.off('scroll', onScroll);
      api.off('pointerUp', onPointerUp);
      api.off('pointerDown', onPointerDown);
    };
  }, [api, isDragging, onPointerDown, onPointerUp, onScroll]);
}
