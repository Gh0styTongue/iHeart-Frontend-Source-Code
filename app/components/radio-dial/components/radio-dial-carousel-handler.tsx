import { CarouselHandler } from '@iheartradio/web.accomplice/components/carousel';

import { RadioDialFilters } from '~app/components/radio-dial/filters';

export function LiveRadioDialCarouselHandler() {
  return (
    <CarouselHandler data-test="radio-dial-carousel-handler">
      <RadioDialFilters />
    </CarouselHandler>
  );
}
