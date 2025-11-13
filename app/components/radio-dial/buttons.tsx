import { lightDark, vars } from '@iheartradio/web.accomplice';
import type { ButtonProps } from '@iheartradio/web.accomplice/components/button';
import { Button } from '@iheartradio/web.accomplice/components/button';
import { Text } from '@iheartradio/web.accomplice/components/text';
import { Radio } from '@iheartradio/web.accomplice/icons/radio';
import { Scan } from '@iheartradio/web.accomplice/icons/scan';
import { useMemo } from 'react';
import { isNonNullish } from 'remeda';
import { $path } from 'safe-routes';

import { trackClick } from '~app/analytics/track-click';
import { useGetPageName } from '~app/hooks/use-get-page-name';
import { playback } from '~app/playback/playback';
import { getMarketSlug } from '~app/routes/_app/live.country.$country.(city).($marketSlug)/utils';

import { useRadioDialData } from './state/radio-dial-data';

export function ScanButton(props: ButtonProps) {
  const { isScanning } = playback.useState();

  return (
    <Button
      color="transparent"
      css={{
        backgroundColor: {
          default:
            isScanning ?
              vars.color.red550
            : lightDark(vars.color.brandWhite, vars.color.gray600),
          hover:
            isScanning ?
              vars.color.red650
            : lightDark(vars.color.gray200, vars.color.gray500),
        },
        maxWidth: '80rem',
        width: '100%',
      }}
      kind="primary"
      {...props}
    >
      <Scan
        color={
          isScanning ? vars.color.brandWhite
          : props.isDisabled ?
            lightDark(vars.color.gray300, vars.color.gray400)
          : lightDark(vars.color.red600, vars.color.red300)
        }
      />
      <Text
        as="span"
        color={
          isScanning ? vars.color.brandWhite
          : props.isDisabled ?
            'inherit'
          : lightDark(vars.color.red600, vars.color.red300)
        }
        kind="button-2"
      >
        {isScanning ? 'Stop Scan' : 'Scan Stations'}
      </Text>
    </Button>
  );
}

export function ViewAllButton(props: Omit<ButtonProps, 'href' | 'onPress'>) {
  const [liveRadioDialData] = useRadioDialData();
  const pageName = useGetPageName();

  const viewAllLink = useMemo(
    () =>
      isNonNullish(liveRadioDialData.market?.city) ?
        $path(
          '/live/country/:country/city/:marketSlug?',
          {
            country: liveRadioDialData.country,
            marketSlug: getMarketSlug({
              city: liveRadioDialData.market.city,
              stateAbbreviation: liveRadioDialData.market.stateAbbreviation,
              marketId: liveRadioDialData.market.marketId,
            }),
          },
          liveRadioDialData.genreId > 0 ?
            { genreId: String(liveRadioDialData.genreId) }
          : {},
        )
      : $path(
          '/live/country/:country/:marketSlug?',
          { country: liveRadioDialData.country },
          liveRadioDialData.genreId > 0 ?
            { genreId: String(liveRadioDialData.genreId) }
          : {},
        ),
    [
      liveRadioDialData.country,
      liveRadioDialData.genreId,
      liveRadioDialData.market?.city,
      liveRadioDialData.market?.stateAbbreviation,
      liveRadioDialData.market?.marketId,
    ],
  );

  return (
    <Button
      color="default"
      css={{
        maxWidth: '80rem',
        width: '100%',
      }}
      href={viewAllLink}
      kind="primary"
      onPress={() =>
        trackClick({
          pageName,
          sectionName: 'radio_dial',
          location: 'view_all_button',
        })
      }
      textColor={{
        dark: vars.color.blue200,
        light: vars.color.blue600,
      }}
      {...props}
    >
      <Radio color={lightDark(vars.color.blue600, vars.color.blue300)} />
      <Text
        as="span"
        color={lightDark(vars.color.blue600, vars.color.blue300)}
        kind="button-2"
      >
        View All Stations
      </Text>
    </Button>
  );
}
