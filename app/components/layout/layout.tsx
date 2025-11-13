import { lightDark, vars } from '@iheartradio/web.accomplice';
import { Box } from '@iheartradio/web.accomplice/components/box';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import { useFullScreenPlayer } from '@iheartradio/web.accomplice/components/player';
import type React from 'react';

import { Footer } from '~app/components/footer';
import { Nav } from '~app/components/navigation';
import { Player } from '~app/playback/player';
import { stickyItems } from '~app/utilities/constants';

import { ContentOverlay } from '../content-overlay';
import { SearchBar } from '../search-bar';

export type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const { isOpen: isFullScreen } = useFullScreenPlayer();

  return (
    <>
      <Nav />
      <Player />
      <Flex
        asChild
        backgroundColor={lightDark(vars.color.gray100, vars.color.brandBlack)}
        data-test="main"
        flexDirection="column"
        id="main"
        minHeight={{
          mobile: `calc(100dvh - ${stickyItems.mobileNav})`,
          large: '100dvh',
        }}
        paddingBottom={{
          mobile:
            isFullScreen ?
              `calc(12.4rem - ${stickyItems.mobileNav})`
            : '12.4rem',
          large: isFullScreen ? 0 : stickyItems.desktopPlayerHeight,
        }}
        paddingLeft={{ mobile: 0, large: stickyItems.desktopLeftNav }}
        paddingTop={{ mobile: stickyItems.mobileNav, large: 0 }}
        transition="all ease-in-out .3s"
        width="100%"
      >
        <main>
          <ContentOverlay />
          <SearchBar />
          <Flex flexDirection="column" flexGrow={1} width="100%">
            <Box flexGrow={0} height="0px" id="scroll-target" width="100%" />
            {children}
          </Flex>
          <Box alignSelf="stretch">
            <Footer />
          </Box>
        </main>
      </Flex>
    </>
  );
}
