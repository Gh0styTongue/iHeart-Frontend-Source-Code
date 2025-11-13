import { breakpoints, vars } from '@iheartradio/web.accomplice';
import { Apple } from '@iheartradio/web.accomplice/apps/apple';
import { Google } from '@iheartradio/web.accomplice/apps/google';
import { Box } from '@iheartradio/web.accomplice/components/box';
import { Button } from '@iheartradio/web.accomplice/components/button';
import {
  Dialog,
  DialogContainer,
  DialogTitle,
} from '@iheartradio/web.accomplice/components/dialog';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import { Link } from '@iheartradio/web.accomplice/components/link';
import {
  Navigation,
  NavigationHeader,
  NavigationItem,
  NavigationList,
  NavigationLogo,
  NavigationWrapper,
} from '@iheartradio/web.accomplice/components/navigation';
import { useFullScreenPlayer } from '@iheartradio/web.accomplice/components/player';
import { Spacer } from '@iheartradio/web.accomplice/components/spacer';
import { Text } from '@iheartradio/web.accomplice/components/text';
import { Home } from '@iheartradio/web.accomplice/icons/home';
import { Library } from '@iheartradio/web.accomplice/icons/library';
import { Microphone } from '@iheartradio/web.accomplice/icons/microphone';
import { Playlist } from '@iheartradio/web.accomplice/icons/playlist';
import { Radio } from '@iheartradio/web.accomplice/icons/radio';
import { Search } from '@iheartradio/web.accomplice/icons/search';
import { UserFilled } from '@iheartradio/web.accomplice/icons/user-filled';
import { LogotypeSecondary } from '@iheartradio/web.accomplice/logos/logotype-secondary';
import { StationEnum } from '@iheartradio/web.api/amp';
import { useCallback, useMemo, useState } from 'react';
import { NavLink, useLocation, useMatches, useNavigate } from 'react-router';
import { pathOr } from 'remeda';
import { ClientOnly } from 'remix-utils/client-only';
import { useHydrated } from 'remix-utils/use-hydrated';
import { $path } from 'safe-routes';
import { useMediaQuery } from 'usehooks-ts';
import { v4 as uuid } from 'uuid';

import { NavAd } from '~app/ads/display/nav-ad';
import { searchOpen } from '~app/analytics/search-open';
import { trackClick } from '~app/analytics/track-click';
import { useSearchSessionContext } from '~app/contexts/search-session';
import { useUser } from '~app/contexts/user';
import { useLoginUrl } from '~app/hooks/auth-urls';
import { AF_CampaignIds, useAppsFlyer } from '~app/hooks/use-apps-flyer';
import { useGetPageName } from '~app/hooks/use-get-page-name';
import { useIsMobileBreakpoint } from '~app/hooks/use-is-mobile-breakpoint';
import { usePrefetchRecentlyPlayed } from '~app/queries/recently-played';
import type { RouteHandle } from '~app/types';
import { Routes, stickyItems } from '~app/utilities/constants';

import { AuthSettings } from './auth-settings';

const qrCodeContainerId = 'get-the-app-qr-code' as const;

export function Nav() {
  const isMobile = useIsMobileBreakpoint();
  const appsFlyer = useAppsFlyer();
  const { isAnonymous = true } = useUser() ?? {};
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const pageName = useGetPageName();
  const loginUrl = useLoginUrl();
  const isLarge = useMediaQuery(breakpoints.large);
  const { isOpen: isFullScreen } = useFullScreenPlayer();
  const searchSession = useSearchSessionContext();
  const isHydrated = useHydrated();
  const prefetchRecentlyPlayed = usePrefetchRecentlyPlayed();

  const [showQrCode, setShowQrCode] = useState<boolean>(false);

  const navProfile = (useMatches() as { handle?: RouteHandle }[]).some(match =>
    pathOr(match, ['handle', 'navProfile'], false),
  );

  const onAppClick = useCallback(() => {
    trackClick({
      pageName,
      sectionName: isMobile ? 'header' : 'left_navigation',
      location: 'listen_on_app_button',
    });
    if (isMobile) {
      appsFlyer.generateLink();
    } else {
      setShowQrCode(shown => !shown);
    }
  }, [pageName, appsFlyer, isMobile]);

  const doNavigation = useCallback(
    (location: string) => {
      trackClick({
        pageName,
        sectionName: isMobile ? 'bottom_navigation' : 'left_navigation',
        location: `${location}_directory`,
      });
    },
    [isMobile, pageName],
  );

  return (
    <>
      <Box asChild data-test="nav-box" zIndex={vars.zIndex[3]}>
        <Navigation
          data-has-button
          data-test="navigation-wrapper"
          key={`${isAnonymous ? 'anon' : 'auth'}-nav`}
        >
          {/* minHeight has been added here because other components top(sticky) property dependent on it */}
          <Box asChild minHeight={stickyItems.mobileNav}>
            <NavigationHeader
              data-anonymous={isAnonymous}
              navProfile={navProfile}
            >
              <NavLink
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  flexShrink: 0,
                  height: '4.8rem',
                }}
                to={$path(Routes.Home)}
              >
                <LogotypeSecondary
                  aria-label="iHeart Header Logotype"
                  media="mobile"
                  size={24}
                />
              </NavLink>
              <Box
                alignItems="center"
                display={{ mobile: 'flex', large: 'none' }}
                flexShrink={1}
                gap={vars.space[8]}
                height="4.8rem"
              >
                <Button color="blue" onPress={() => onAppClick()} size="small">
                  Listen on the app
                </Button>
                <Button
                  color="gray"
                  data-display // This bit is used in `/packages/accomplice/src/components/navigation/navigation.css.ts#90`
                  data-test="search"
                  kind="tertiary"
                  onPress={() => {
                    const sessionId = uuid();
                    searchSession.serialize({
                      open: true,
                      start: false,
                      sessionId,
                    });
                    searchOpen({
                      search: {
                        sessionId,
                      },
                      event: {
                        location: 'header',
                      },
                      view: {
                        pageName: pageName === '' ? 'home' : pageName,
                      },
                    });
                    navigate($path(Routes.Search));
                  }}
                  size="icon"
                >
                  <Search />
                </Button>

                {!isHydrated || isAnonymous ?
                  <Button
                    color="gray"
                    data-test="login"
                    href={loginUrl.toString()}
                    kind="tertiary"
                    rel="nofollow"
                    size="icon"
                  >
                    <UserFilled size={24} />
                  </Button>
                : <AuthSettings />}
              </Box>
            </NavigationHeader>
          </Box>
          <NavigationWrapper>
            <NavigationLogo>
              <Link href={$path(Routes.Home)}>
                <LogotypeSecondary
                  aria-label="iHeart Navigation Logotype"
                  media="desktop"
                  size={24}
                />
              </Link>
            </NavigationLogo>
            <Flex
              direction="column"
              height="100%"
              justifyContent="space-between"
            >
              <Flex direction="column" justifyContent="flex-start">
                <NavigationList>
                  <NavigationItem
                    asChild
                    isActive={
                      pathname === Routes.Home ||
                      pathname.startsWith(Routes.RecentlyPlayed)
                    }
                    onHover={() => {
                      prefetchRecentlyPlayed();
                    }}
                  >
                    <NavLink data-test="home" end to={$path(Routes.Home)}>
                      <Home />
                      Home
                    </NavLink>
                  </NavigationItem>
                  <NavigationItem
                    asChild
                    isActive={pathname.startsWith(Routes.Search)}
                    onClick={() => {
                      const sessionId = uuid();
                      searchSession.serialize({
                        open: true,
                        start: false,
                        sessionId,
                      });
                      searchOpen({
                        search: {
                          sessionId,
                        },
                        event: {
                          location:
                            isMobile ? 'bottom_navigation' : 'left_navigation',
                        },
                        view: {
                          pageName: pageName === '' ? 'home' : pageName,
                        },
                      });
                    }}
                  >
                    <NavLink
                      data-test="search"
                      end
                      rel="nofollow"
                      state={{ searchOpen: true }}
                      to={$path(Routes.Search)}
                    >
                      <Search />
                      Search
                    </NavLink>
                  </NavigationItem>
                  <NavigationItem
                    asChild
                    isActive={pathname.startsWith(Routes.Radio)}
                    onHover={() => {
                      prefetchRecentlyPlayed({
                        stationTypes: [StationEnum.RADIO, StationEnum.LIVE],
                      });
                    }}
                    onPress={() => {
                      doNavigation('radio');
                    }}
                  >
                    <NavLink data-test="radio" id="radio" to={Routes.Radio}>
                      <Radio />
                      Radio
                    </NavLink>
                  </NavigationItem>
                  <NavigationItem
                    asChild
                    isActive={pathname.startsWith(Routes.Podcast.Directory)}
                    onHover={() => {
                      prefetchRecentlyPlayed({
                        stationTypes: [StationEnum.PODCAST],
                      });
                    }}
                    onPress={() => {
                      doNavigation('podcast');
                    }}
                  >
                    <NavLink
                      data-test="podcasts"
                      id="podcasts"
                      to={Routes.Podcast.Directory}
                    >
                      <Microphone />
                      Podcasts
                    </NavLink>
                  </NavigationItem>
                  <NavigationItem
                    asChild
                    isActive={pathname.startsWith(Routes.Playlist.Directory)}
                    onHover={() => {
                      prefetchRecentlyPlayed({
                        stationTypes: [StationEnum.COLLECTION],
                      });
                    }}
                    onPress={() => {
                      doNavigation('playlist');
                    }}
                  >
                    <NavLink
                      data-test="playlists"
                      id="playlists"
                      to={Routes.Playlist.Directory}
                    >
                      <Playlist />
                      Playlists
                    </NavLink>
                  </NavigationItem>
                  <Box display={{ mobile: 'none', large: 'flex' }} width="100%">
                    <NavigationItem
                      asChild
                      isActive={pathname.startsWith(Routes.Library.Root)}
                      onPress={() => {
                        trackClick({
                          pageName,
                          sectionName: 'left_navigation',
                          location: 'my_library',
                        });
                      }}
                    >
                      <NavLink
                        data-test="library"
                        id="library"
                        rel="nofollow"
                        to={
                          !isHydrated || isAnonymous ?
                            $path(Routes.Library.Root)
                          : $path('/library/stations/:type', { type: 'live' })
                        }
                      >
                        <Library />
                        Your Library
                      </NavLink>
                    </NavigationItem>
                  </Box>
                  <Box
                    display={{ mobile: 'none', large: 'flex' }}
                    justifyContent="flex-start"
                    paddingX={vars.space[16]}
                    paddingY={vars.space[8]}
                    width="100%"
                  >
                    <Button
                      color="blue"
                      kind="primary"
                      onPress={() => onAppClick()}
                      size="small"
                    >
                      Listen on the app
                    </Button>
                  </Box>
                </NavigationList>
              </Flex>
              <ClientOnly>
                {() =>
                  isLarge ?
                    <Spacer
                      bottom={
                        isFullScreen ?
                          vars.space[8]
                        : `calc(${stickyItems.desktopPlayerHeight} + ${vars.space[8]})`
                      }
                      left={vars.space[8]}
                    >
                      <NavAd />
                    </Spacer>
                  : null
                }
              </ClientOnly>
            </Flex>
          </NavigationWrapper>
        </Navigation>
      </Box>
      <DialogContainer
        isDismissable
        onDismiss={() => setShowQrCode(shown => !shown)}
      >
        {showQrCode ?
          <QRCodeDialog />
        : null}
      </DialogContainer>
    </>
  );
}

// The implementation ticket (https://ihm-it.atlassian.net/browse/IHRWEB-22779) says that the QR code
// should be 240px square, but the designs
// (https://www.figma.com/design/wZL6v31irvSmCu4Kv01d9K/US-Launch-Features?node-id=1027-104822&m=dev)
// show that it should be 172px square
const QR_CODE_SIZE = 240;

function QRCodeDialog() {
  const appsFlyer = useAppsFlyer();

  const badgeHref = useMemo(
    () => appsFlyer.generateLink(AF_CampaignIds.ListenGetTheApp, false),
    [appsFlyer],
  );

  return (
    <Dialog>
      <Flex alignItems="center" direction="column" gap="$16">
        <DialogTitle>Download the iHeart app for free</DialogTitle>
        <Text kind="body-3">Scan the QR code to download now</Text>
        <Box
          height={`${QR_CODE_SIZE}px`}
          id={qrCodeContainerId}
          ref={element => {
            if (element) {
              appsFlyer.generateQrCode(element.id, {
                campaign: AF_CampaignIds.ListenGetTheApp,
                size: QR_CODE_SIZE,
              });
              return () => {
                appsFlyer.clearQrCode(element.id);
              };
            }
          }}
          width={`${QR_CODE_SIZE}px`}
        />
        <Flex direction="row" gap="$16">
          {badgeHref ?
            <>
              <a href={badgeHref} rel="noreferrer" target="_blank">
                <Apple width="120px" />
              </a>
              <a href={badgeHref} rel="noreferrer" target="_blank">
                <Google width="135px" />
              </a>
            </>
          : null}
        </Flex>
      </Flex>
    </Dialog>
  );
}
