import { useCarousel } from '@iheartradio/web.accomplice/components/carousel';
import { useEffect } from 'react';
import { isNonNullish } from 'remeda';

import { RadioDialCarouselSlide } from '~app/components/radio-dial/components/radio-dial-carousel-slide';
import { useRadioDialData } from '~app/components/radio-dial/state/radio-dial-data';
import { useGetPageName } from '~app/hooks/use-get-page-name';

export function LiveRadioDialCarouselContent({
  sectionPosition,
}: {
  sectionPosition: number;
}) {
  const pageName = useGetPageName();
  const [liveRadioDialData] = useRadioDialData();
  const { scrollToIndex } = useCarousel();

  useEffect(() => {
    if (isNonNullish(liveRadioDialData.currentIndex)) {
      scrollToIndex(liveRadioDialData.currentIndex);
    }
  }, [liveRadioDialData.currentIndex, scrollToIndex]);

  return liveRadioDialData.stations.map((station, index) => (
    <RadioDialCarouselSlide
      currentStation={liveRadioDialData.currentStation}
      index={index}
      key={station.id}
      pageName={pageName}
      sectionPosition={sectionPosition}
      station={station}
    />
  ));
}
