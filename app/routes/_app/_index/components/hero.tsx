import { Box } from '@iheartradio/web.accomplice/components/box';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import { useEffect, useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';

import { GoogleAds } from '~app/ads/display/ads';
import { HeroAdvert } from '~app/ads/display/home-hero-ad';

import { MarketingBanner } from './marketing-banner';

export function Hero() {
  const [hasAdvert, setHasAdvert] = useState(false);

  useEffect(() => {
    // subscribing to the getAdvertElementId function to know If profile takeover present
    const unsubscribe = GoogleAds.subscribe({
      removeSlot(id) {
        if (id === 'hero') {
          setHasAdvert(false);
        }
      },

      slotOnLoad(id) {
        if (id === 'hero') {
          setHasAdvert(true);
        }
      },
    });

    return () => {
      unsubscribe();
      setHasAdvert(false);
    };
  }, []);

  return (
    <Box paddingBottom={{ large: '$32' }}>
      <Flex
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        position="relative"
      >
        <MarketingBanner />
        <ClientOnly>
          {() => {
            return <HeroAdvert hasAdvert={hasAdvert} />;
          }}
        </ClientOnly>
      </Flex>
    </Box>
  );
}
