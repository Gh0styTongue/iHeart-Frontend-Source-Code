import { lightDark, vars } from '@iheartradio/web.accomplice';
import { Box } from '@iheartradio/web.accomplice/components/box';
import { MediaServerURL } from '@iheartradio/web.assets';
import { StationType } from '@iheartradio/web.playback';
import { useMemo } from 'react';
import { isNonNullish } from 'remeda';

import { useItemSelected } from '~app/analytics/use-item-selected';
import { CardCarouselSlide } from '~app/components/card-carousel/card-carousel';
import {
  ContentCard,
  ContentCardImage,
} from '~app/components/content-card/content-card';
import { useIsMobile } from '~app/contexts/is-mobile';
import {
  type LivePlayProps,
  LivePlay,
} from '~app/playback/controls/play/live-play';
import { useIsCurrentStation } from '~app/playback/controls/play/use-is-current-station';
import type { LiveStation } from '~app/queries/radio-dial';
import { ANALYTICS_LOCATION, AnalyticsContext } from '~app/utilities/constants';
import { buildLiveUrl } from '~app/utilities/urls';

export function RadioDialCarouselSlide({
  currentStation,
  index,
  pageName,
  sectionPosition,
  station,
}: {
  currentStation: number | undefined;
  index: number;
  pageName: string;
  sectionPosition: number;
  station: Omit<LiveStation, 'index'>;
}) {
  const isMobile = useIsMobile();
  const { onItemSelected } = useItemSelected();

  const playContext: LivePlayProps['context'] = {
    pageName,
    playedFrom: 1003,
    eventLocation: ANALYTICS_LOCATION.CAROUSEL,
  };

  const isActive = useMemo(
    () => station.id === currentStation,
    [currentStation, station.id],
  );
  const isCurrentLiveStation = useIsCurrentStation({
    type: StationType.Live,
    id: station.id ?? 0,
    context: playContext,
  });

  return isNonNullish(station.id) ?
      <CardCarouselSlide
        aria-label={`${station.name}`}
        data-test="live-radio-dial-slide"
        key={station.id}
      >
        <ContentCard
          description={station.description}
          href={buildLiveUrl({ name: station.name, id: station.id })}
          image={
            <Box
              backgroundColor={lightDark(
                vars.color.brandWhite,
                vars.color.brandBlack,
              )}
              borderRadius={vars.radius[6]}
            >
              <ContentCardImage
                alt={station.name ?? ''}
                decoding={index === 0 ? 'sync' : 'auto'}
                index={index}
                src={MediaServerURL.fromCatalog({
                  type: 'live',
                  id: station.id,
                })}
                width={isMobile ? 75 : 150}
              />
            </Box>
          }
          imageButton={<LivePlay context={playContext} id={station.id} />}
          isActive={isActive || isCurrentLiveStation}
          key={station.id}
          linesForTitle={1}
          onPress={() => {
            onItemSelected({
              pageName,
              section: 'radio_dial',
              context: AnalyticsContext.Carousel,
              sectionPosition,
              itemPosition: index,
              assets: {
                asset: {
                  id: `${StationType.Live}|${station.id}`,
                  name: station.name ?? '',
                },
              },
            });
          }}
          previewShape="square"
          title={station.name}
        />
      </CardCarouselSlide>
    : null;
}
