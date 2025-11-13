import type { CardImageProps } from '@iheartradio/web.accomplice/components/card';
import { useMemo } from 'react';
import { isNullish, isNumber } from 'remeda';

import { useCardCarousel } from '~app/components/card-carousel/card-carousel';
import { useResponsiveGridContext } from '~app/components/responsive-grid/responsive-grid';

export function useImageLoadingProps(
  index?: number,
  maxSlidesToShow_?: number,
) {
  let maxSlidesToShow = maxSlidesToShow_;
  const [gridMaxSlidesToShow] = useResponsiveGridContext();
  const carouselMaxSlidesToShow = useCardCarousel()?.maxSlidesToShow;

  if (isNullish(maxSlidesToShow)) {
    maxSlidesToShow = gridMaxSlidesToShow ?? carouselMaxSlidesToShow;
  }

  return useMemo(() => {
    const loadingProps: Pick<
      CardImageProps,
      'decoding' | 'fetchPriority' | 'loading'
    > = {};

    if (isNumber(index) && index === 0) {
      loadingProps.fetchPriority = 'high';
    }

    // If we have these values, we can dynamically specify some of the image attributes which affect loading behavior
    if (isNumber(index) && isNumber(maxSlidesToShow)) {
      // The number of slides we consider to be initially rendered is the max plus one to account for peeks.
      const isInitialSlide = index <= maxSlidesToShow;

      loadingProps.decoding = isInitialSlide ? 'auto' : 'async';
      loadingProps.loading = isInitialSlide ? 'eager' : 'lazy';
    }

    return { loadingProps };
  }, [index, maxSlidesToShow]);
}
