import { lightDark, vars } from '@iheartradio/web.accomplice';
import { Button } from '@iheartradio/web.accomplice/components/button';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import { Text } from '@iheartradio/web.accomplice/components/text';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { $path } from 'safe-routes';

import { trackClick } from '~app/analytics/track-click';
import { Routes } from '~app/utilities/constants';

export function YourLibraryCarousel() {
  const navigate = useNavigate();

  const onSelectionChange = useCallback((location: string) => {
    trackClick({
      pageName: 'home',
      sectionName: 'your_library',
      location,
    });
  }, []);

  return (
    <Flex
      flexDirection="column"
      gap={vars.space[16]}
      padding={{ mobile: '$16', large: '$32' }}
    >
      <Text
        as="h3"
        css={{
          color: lightDark('$gray600', '$brandWhite'),
        }}
        kind={{ mobile: 'h4', large: 'h3' }}
      >
        Your Library
      </Text>
      <Flex gap={vars.space[16]} overflowX="scroll" scrollbarWidth="none">
        <Button
          color="gray"
          kind="secondary"
          onPress={() => {
            onSelectionChange('stations');
            navigate($path('/library/stations/:type', { type: 'live' }));
          }}
          size="large"
        >
          Stations
        </Button>
        <Button
          color="gray"
          kind="secondary"
          onPress={() => {
            onSelectionChange('podcasts');
            navigate($path(Routes.Library.Podcasts));
          }}
          size="large"
        >
          Podcasts
        </Button>
        <Button
          color="gray"
          kind="secondary"
          onPress={() => {
            onSelectionChange('playlists');
            navigate($path(Routes.Library.Playlists.Root));
          }}
          size="large"
        >
          Playlists
        </Button>
      </Flex>
    </Flex>
  );
}
