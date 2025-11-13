import { lightDark } from '@iheartradio/web.accomplice';
import { Box } from '@iheartradio/web.accomplice/components/box';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import { Link } from '@iheartradio/web.accomplice/components/link';
import { Text } from '@iheartradio/web.accomplice/components/text';

import { useConfig } from '~app/contexts/config';
import { useAppsFlyer } from '~app/hooks/use-apps-flyer';

import { DevicesGraphic } from './devices-graphic';

export function DownloadTheAppRow() {
  const config = useConfig();
  const appsFlyer = useAppsFlyer();

  return (
    <Box
      alignItems="center"
      display={{ mobile: 'none', large: 'flex' }}
      gap="$24"
      justifyContent="space-between"
      paddingX="$32"
      paddingY="$24"
    >
      <Flex
        color={lightDark('$gray600', '$brandWhite')}
        direction="column"
        gap="$8"
      >
        <Text kind="h3">Bring iHeart with you anywhere</Text>
        <Text kind="body-3">
          The free iHeart app is available on over 200 platforms, including Web,{' '}
          <Link
            color="secondary"
            onPress={() => appsFlyer?.generateLink()}
            target="_blank"
            underline="always"
          >
            iOS
          </Link>
          ,{' '}
          <Link
            color="secondary"
            onPress={() => appsFlyer?.generateLink()}
            target="_blank"
            underline="always"
          >
            Android
          </Link>
          ,{' '}
          <Link
            color="secondary"
            href={config.urls.appsHome!}
            target="_blank"
            underline="always"
          >
            Alexa
          </Link>
          ,{' '}
          <Link
            color="secondary"
            href={config.urls.appsAuto!}
            target="_blank"
            underline="always"
          >
            Automobiles
          </Link>
          , and more.
        </Text>
      </Flex>
      <Box
        height="auto"
        maxHeight={{ mobile: '30rem', xlarge: 'none' }}
        maxWidth="94rem"
        minWidth={{ mobile: '$7', xlarge: '$6' }}
        width="100%"
      >
        <DevicesGraphic />
      </Box>
    </Box>
  );
}
