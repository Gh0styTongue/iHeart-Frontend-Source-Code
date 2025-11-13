import { vars } from '@iheartradio/web.accomplice';
import { Box } from '@iheartradio/web.accomplice/components/box';
import type { CarouselProps } from '@iheartradio/web.accomplice/components/carousel';
import { Flex } from '@iheartradio/web.accomplice/components/flex';

import { useIsMobile } from '~app/contexts/is-mobile';

import type { CardCarouselKind } from '../card-carousel/card-carousel';
import {
  CardCarousel,
  CardCarouselSlide,
} from '../card-carousel/card-carousel';
import { ContentCard } from '../content-card/content-card';

/**
 * INFO: This is a workaround to render a hidden carousel to prevent layout shift for empty states.
 * It ensures that empty states remain responsive based on carouselKind. If no carouselKind is passed,
 * then the CTABanner will render as static and not responsive
 */
export const CarouselPlaceHolder = <K extends CardCarouselKind>({
  carouselKind,
  carouselSlideGap,
  editable,
}: {
  carouselKind: K;
  carouselSlideGap: CarouselProps['slideGap'];
  editable: boolean;
}) => {
  const isMobile = useIsMobile();

  if (!carouselKind) {
    return null;
  }

  return (
    <Box data-test="cta-banner-carousel" gridArea="content" visibility="hidden">
      <CardCarousel
        items={[
          {
            id: 'CTABanner',
            index: 0,
          },
        ]}
        kind={carouselKind}
        slideGap={carouselSlideGap}
        title={
          // this is needed since scroll buttons are hidden on mobile via media query
          isMobile && editable ?
            <Box visibility="hidden">
              <Flex height={vars.space[32]}></Flex>
            </Box>
          : null
        }
      >
        {() => {
          return (
            <CardCarouselSlide>
              <ContentCard
                image={
                  <img
                    alt=""
                    decoding="auto"
                    loading="eager"
                    src="data:image/png;base64,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"
                    style={{
                      width: '100%',
                    }}
                  />
                }
              />
            </CardCarouselSlide>
          );
        }}
      </CardCarousel>
    </Box>
  );
};
