import { Flex } from '@iheartradio/web.accomplice/components/flex';
import { addToast } from '@iheartradio/web.accomplice/components/toast';
import { HydrationBoundary } from '@tanstack/react-query';
import { memo, useEffect } from 'react';
import {
  type ShouldRevalidateFunction,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from 'react-router';
import { ClientOnly } from 'remix-utils/client-only';

import { InlineAd } from '~app/ads/display/inline-ad';
import { usePageView } from '~app/analytics/use-page-view';
import { RadioDial } from '~app/components/radio-dial';
import { RecentlyPlayedCarousel } from '~app/components/recently-played/recently-played-carousel';
import { useConfig } from '~app/contexts/config';
import { PresetCarouselId } from '~app/contexts/presets/presets-drawer';
import { useLoginUrl } from '~app/hooks/auth-urls';

import type { HomeServerLoader } from './.server/loader';
import { DownloadTheAppRow } from './components/download-the-app';
import { Hero } from './components/hero';
import { PresetsCarousel } from './components/presets-carousel';
import { SearchRow } from './components/search-row';
import { TopArtistsCarousel } from './components/top-artists-carousel';
import { TopPlaylistsCarousel } from './components/top-playlists-carousel';
import { TopPodcastsCarousel } from './components/top-podcasts-carousel';
import { TrendingSection } from './components/trending-section';
import { YourLibraryCarousel } from './components/your-library-carousel';

export { loader } from './.server/loader';
export { headers } from '~app/defaults.server';

const BAD_SESSION = 'badsession';

/**
 * We add this for a very specific reason. When the search params of a url change, by default remix
 * will call the loaders of the page because it is technically a new url pattern. This makes sense,
 * but for our use case, we want to update the search params but not hit the server again after the
 * initial load because we want react-query to perform our fetching client-side.
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  nextUrl,
}) => {
  return !(currentUrl.pathname === nextUrl.pathname);
};

export const Homepage = memo(function Homepage({
  showMarketingBanner,
}: {
  showMarketingBanner?: boolean;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const config = useConfig();
  const navigate = useNavigate();
  const loginUrl = useLoginUrl();

  // Moved the player subscription for updating recently played into the recently played component
  // itself, so that we can have that functionality on any page that renders <RecentlyPlayed />
  // [DEM 2025/03/12]

  // TODO: Is this the *best* place for this???? [DEM 2024/11/19]
  // If root loader detected an invalid session, the user will be redirected to home with a
  // query param of `?message=badsession`. This effect looks for that message key and displays
  // a toast notification notifying the user they need to log in again
  useEffect(() => {
    if (searchParams.get('message') === BAD_SESSION) {
      addToast({
        kind: 'error',
        timeout: 10_000,
        title: 'Session expired',
        text: 'Please log in again',
        actions: [
          {
            kind: 'primary',
            color: 'white',
            href: loginUrl.toString(),
            content: 'Log In',
            size: 'small',
          },
        ],
      });

      setSearchParams(previous => {
        previous.delete('message');
        return previous;
      });
    }
  }, [searchParams, setSearchParams, config.urls.account, navigate, loginUrl]);

  let sectionPosition = 0;

  return (
    <Flex direction="column" width="100%">
      {showMarketingBanner ?
        <Hero />
      : null}
      <PresetsCarousel type={PresetCarouselId.Home} />
      <ClientOnly>{() => <InlineAd />}</ClientOnly>
      <RadioDial sectionPosition={sectionPosition++} />
      <RecentlyPlayedCarousel sectionPosition={sectionPosition++} />
      <YourLibraryCarousel />
      <TrendingSection />
      <TopPodcastsCarousel sectionPosition={sectionPosition++} />
      <TopPlaylistsCarousel sectionPosition={sectionPosition++} />
      <TopArtistsCarousel sectionPosition={sectionPosition++} />
      <SearchRow />
      <DownloadTheAppRow />
    </Flex>
  );
});

export default function Home() {
  const { dehydratedState, pageName, showMarketingBanner } =
    useLoaderData<HomeServerLoader>();

  usePageView(pageName);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Homepage showMarketingBanner={showMarketingBanner} />
    </HydrationBoundary>
  );
}
