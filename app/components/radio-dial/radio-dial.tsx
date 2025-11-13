import { Flex } from '@iheartradio/web.accomplice/components/flex';

import { CardCarousel } from '~app/components/card-carousel/card-carousel';
import { ScanButton, ViewAllButton } from '~app/components/radio-dial/buttons';
import { LiveRadioDialCarouselContent } from '~app/components/radio-dial/components/radio-dial-carousel-content';
import { LiveRadioDialCarouselHandler } from '~app/components/radio-dial/components/radio-dial-carousel-handler';
import { EmptyState } from '~app/components/radio-dial/components/radio-dial-empty-state';
import { ScanContextProvider } from '~app/components/radio-dial/scan-context';
import {
  RadioDialDataProvider,
  useRadioDialData,
} from '~app/components/radio-dial/state/radio-dial-data';

import { useRadioDialCallbacks } from './callbacks';
import { RadioDialEffects } from './effects';

export function RadioDial({ sectionPosition }: { sectionPosition: number }) {
  return (
    <RadioDialDataProvider>
      <ScanContextProvider>
        <RadioDial_ sectionPosition={sectionPosition} />
      </ScanContextProvider>
    </RadioDialDataProvider>
  );
}

function RadioDial_({ sectionPosition }: { sectionPosition: number }) {
  const [liveRadioDialData] = useRadioDialData();

  const {
    doPlay,
    getCurrentScanStation,
    onStopScan,
    unsetAllActiveIndicators,
    updateRecentlyPlayed,
    visibilityChangeHandler,
  } = useRadioDialCallbacks();

  return (
    <>
      <RadioDialEffects
        getCurrentScanStation={getCurrentScanStation}
        onStopScan={onStopScan}
        unsetAllActiveIndicators={unsetAllActiveIndicators}
        updateRecentlyPlayed={updateRecentlyPlayed}
        visibilityChangeHandler={visibilityChangeHandler}
      />
      <Flex
        data-test="live-radio-dial"
        direction="column"
        gap={0}
        paddingBottom={{ mobile: '$12', large: '$32' }}
      >
        <CardCarousel
          data-test="live-radio-dial-stations"
          handler={<LiveRadioDialCarouselHandler />}
          isLoading={liveRadioDialData.isFetching}
          items={liveRadioDialData.stations}
          kind="content"
          renderEmptyState={() => <EmptyState />}
        >
          <LiveRadioDialCarouselContent sectionPosition={sectionPosition} />
        </CardCarousel>
        <Flex
          direction="row"
          gap={{ mobile: '$8', large: '$16' }}
          justifyContent="center"
          px={{ mobile: '$16', large: '$32' }}
        >
          <ScanButton
            isDisabled={liveRadioDialData.stations.length < 3}
            onPress={() => {
              doPlay({ toggleScan: true });
            }}
          />
          <ViewAllButton />
        </Flex>
      </Flex>
    </>
  );
}
