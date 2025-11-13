import '@iheartradio/web.accomplice/globals';

import { RouterProvider, ThemeProvider } from '@iheartradio/web.accomplice';
import { FullScreenProvider } from '@iheartradio/web.accomplice/components/player';
import { GlobalToastRegion } from '@iheartradio/web.accomplice/components/toast';
import normalizeCSSUrl from '@iheartradio/web.accomplice/normalize.css?url';
import resetCSSUrl from '@iheartradio/web.accomplice/reset.css?url';
import { SubscriptionTypeEnum } from '@iheartradio/web.config';
import { getHints } from '@iheartradio/web.remix-shared/client-hints.js';
import { getNewRelicScript } from '@iheartradio/web.remix-shared/error/scripts/newrelic.js';
import { MarketSession } from '@iheartradio/web.remix-shared/isomorphic/cookies';
import {
  METADATA_OPENGRAPH_TYPES,
  METADATA_TWITTER_CARDS,
} from '@iheartradio/web.remix-shared/metadata/constants.js';
import { getRootInheritableMeta } from '@iheartradio/web.remix-shared/metadata/meta-inheritance.js';
import { setBasicMetadata } from '@iheartradio/web.remix-shared/metadata/utilities.js';
import type { RequestInfo } from '@iheartradio/web.remix-shared/react/request-info.js';
import { useAbsoluteHref } from '@iheartradio/web.remix-shared/react/router.js';
import { useAppOpenClose } from '@iheartradio/web.remix-shared/react/use-app-open-close.js';
import { useTrackVisibilityChange } from '@iheartradio/web.remix-shared/react/use-track-visibility-change.js';
import { getGeolocationForRequest } from '@iheartradio/web.remix-shared/server/geolocation.js';
import {
  getDomainUrl,
  getForwardedOrigin,
  getOriginReferer,
} from '@iheartradio/web.remix-shared/server/http.js';
import { getThemeFromRequest } from '@iheartradio/web.remix-shared/server/theme.js';
import { getServerTiming } from '@iheartradio/web.server-timing';
import { CCPAUserPrivacy, toURL } from '@iheartradio/web.utilities';
import { isbot } from 'isbot';
import { type ReactNode, useEffect, useMemo, useRef } from 'react';
import {
  data,
  isSession,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigate,
  useRouteLoaderData,
  useSearchParams,
} from 'react-router';
import { isNonNullish } from 'remeda';
import { ClientOnly } from 'remix-utils/client-only';
import { $routeId } from 'safe-routes';

import {
  type DisplayAdsScriptsConfig,
  type HeaderBiddingConfig,
  DisplayAdsScripts,
  GoogleAdsProvider,
} from '~app/ads/display/ads';
import { PlaybackAdsScripts } from '~app/ads/playback';
import { Analytics } from '~app/analytics/analytics';
import { useAnalytics } from '~app/analytics/create-analytics';
import { Layout as PageLayout } from '~app/components/layout';
import { ConfigProvider } from '~app/contexts/config';
import { UserContextProvider, useUser } from '~app/contexts/user';

import type { Route } from './+types/root';
import { AmpClientProvider } from './api/amp-client';
import { getMarketsById, getOrderedMarkets } from './api/markets';
import { WebApiClientProvider } from './api/webapi-client';
import { IsMobileContext } from './contexts/is-mobile';
import { MarketProvider } from './contexts/market';
import { AdsTargetingProvider } from './contexts/monetization';
import { PresetsProvider } from './contexts/presets/presets';
import { PresetsDrawerProvider } from './contexts/presets/presets-drawer';
import { SearchSessionProvider } from './contexts/search-session';
import { ThumbsProvider } from './contexts/thumbs/thumbs';
import { useElevateSearchBar } from './hooks/use-elevate-search-bar';
import { useFullScreenPlayerRoute } from './hooks/use-full-screen-player-route';
import { useGetPageName } from './hooks/use-get-page-name';
import { useVisitCount } from './hooks/use-visit-count';
import { useWindowScrollPosition } from './hooks/use-window-scroll-pos';
import { newrelicConfig } from './newrelic-config.server';
import { PlaybackProvider } from './playback/playback';
import { QueryClientProvider } from './queries/query-client-provider';
import {
  METADATA_APPLE_TOUCH_ICON,
  METADATA_DEFAULT_IMAGE,
  METADATA_GLOBAL_DESCRIPTION,
  METADATA_GLOBAL_KEYWORDS,
  METADATA_GLOBAL_TITLE,
} from './utilities/constants';
import { getLanguageFromLocale } from './utilities/utilities';

export type RootLoader = typeof loader;

export { headers } from '~app/defaults.server';

// 2024/11/30
// Added more preconnects to improve loading times for the scripts that are sourced from these
// domains.. Also removed weights of fonts that were not being used..
export const links: Route.LinksFunction = () => [
  {
    rel: 'shortcut icon',
    href: 'https://www.iheart.com/public/assets/favicon.ico',
    type: 'image/ico',
  },
  {
    rel: 'apple-touch-icon',
    href: METADATA_APPLE_TOUCH_ICON,
  },
  { rel: 'shortcut icon', href: METADATA_APPLE_TOUCH_ICON },
  { rel: 'preconnect', href: 'https://i.iheart.com' },
  // JW Player
  { rel: 'preconnect', href: 'https://ssl.p.jwpcdn.com' },
  { rel: 'preconnect', href: 'https://cdn.jwplayer.com' },
  { rel: 'preconnect', href: 'https://imasdk.googleapis.com' },
  { rel: 'preconnect', href: 'https://www.gstatic.com' },
  // Display Ads
  { rel: 'preconnect', href: 'https://securepubads.g.doubleclick.net' },
  // Triton
  {
    rel: 'preconnect',
    href: 'https://yield-op-idsync.live.streamtheworld.com',
  },
  { rel: 'stylesheet', href: normalizeCSSUrl },
  { rel: 'stylesheet', href: resetCSSUrl },
];

async function clearSessionHandler(request: Request) {
  const url = toURL(request.url);

  if (url.searchParams.has('authenticated')) {
    url.searchParams.delete('market');
    url.searchParams.delete('authenticated');
    const headers = new Headers(request.headers);

    // Market Session
    {
      const marketSession = await MarketSession.getSession(
        request.headers.get('Cookie'),
      );

      if (isSession(marketSession)) {
        headers.append(
          'Set-Cookie',
          await MarketSession.destroySession(marketSession),
        );
      }
    }

    const originRedirectUrl = toURL(url.pathname, getForwardedOrigin(request));

    return redirect(originRedirectUrl.toString(), { headers });
  }
}

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  const { CONFIG_ENV, npm_package_version, SHORT_COMMIT } = process.env;
  const { time, getHeaderField } = getServerTiming({ prefix: 'root' });
  await time('clearSession', () => clearSessionHandler(request));

  // 2024/11/30 - `isMobile` comes from the context, which gets passed down from edge. Defaults to false
  const { authEvent, user, config, locale, isMobile, userType } = context;

  const url = new URL(request.url);

  const referer =
    request.headers.get('referer') ??
    getOriginReferer(request, '/')?.toString();

  const isBotUserAgent = isbot(request.headers.get('user-agent'));

  const headers = new Headers();

  const marketNamesById = await time('getMarketNamesById', getMarketsById());

  const orderedMarkets = await time(
    'getMarketNamesSorted',
    getOrderedMarkets(),
  );

  headers.append('Server-Timing', getHeaderField());

  const hints = getHints(request);

  const newrelic = newrelicConfig[CONFIG_ENV as keyof typeof newrelicConfig];

  const theme = getThemeFromRequest(request) ?? hints.theme;

  const geolocation = getGeolocationForRequest(request);

  return data(
    {
      CONFIG_ENV,
      SHORT_COMMIT,
      appVersion: npm_package_version ?? '',
      authEvent,
      config,
      geolocation,
      isBotUserAgent,
      locale,
      marketNamesById,
      newrelicScript: newrelic ? getNewRelicScript(newrelic) : null,
      orderedMarkets,
      referer,
      user,
      userType,
      // This block is what the new `useTheme` hook uses to determine the correct theme from browser
      // hints or the explicit theme that the user has chosen
      requestInfo: {
        hints: { ...hints, theme },
        isMobile,
        locale,
        origin: getDomainUrl(request),
        hostName: getForwardedOrigin(request) ?? config?.urls?.listen,
        path: url.pathname,
        url: request.url,
        referer,
        userPrefs: {
          theme,
        },
        geo: {
          lat: geolocation.lat,
          lng: geolocation.lng,
        },
      } satisfies RequestInfo,
    },
    {
      headers,
    },
  );
};

/**
 * We only want the root loader to be called once during the initialization of the app. Since we
 * redirect for login, this is a non-issue once a user logs in. This will prevent the root loader
 * from revalidations on each page transition.
 */
export const shouldRevalidate = () => {
  return false;
};

export const meta = ({ data }: Route.MetaArgs) => {
  const { config } = data ?? {};

  return [
    ...setBasicMetadata({
      title: METADATA_GLOBAL_TITLE,
      description: METADATA_GLOBAL_DESCRIPTION,
      keywords: METADATA_GLOBAL_KEYWORDS,
      image: METADATA_DEFAULT_IMAGE,
      type: METADATA_OPENGRAPH_TYPES.Website,
      card: METADATA_TWITTER_CARDS.Summary,
      canonicalUrl: 'https://www.iheart.com',
    }),
    ...getRootInheritableMeta(config),
  ];
};

export default function App(_props: Route.ComponentProps) {
  const { authEvent, locale, config, appVersion, requestInfo } =
    useLoaderData<typeof loader>();
  const pageName = useGetPageName();
  const authEventRef = useRef<string>(null);

  const user = useUser();

  const { visitNum } = useVisitCount();
  const analytics = useAnalytics();
  useTrackVisibilityChange(analytics);
  useAppOpenClose(analytics, 'listen', appVersion, pageName);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const loginToken = searchParams.get('loginToken');

  const isFullScreenPlayerRoute = useFullScreenPlayerRoute();

  // To force mobile rendering add `forceMobile` anywhere in the querystring
  const forceMobile = searchParams.get('forceMobile') !== null;

  const isMobile = requestInfo.isMobile || forceMobile;

  // On initial load of the root, if `loginToken` is present in the URL,
  // forward the user to Account to authenticate with the short-lived token
  useEffect(() => {
    if (loginToken) {
      navigate(`${config?.urls?.account}/login/?loginToken=${loginToken}`);
    }
  }, [loginToken, navigate, config?.urls?.account]);

  if (authEvent && authEventRef.current !== authEvent.type) {
    authEventRef.current = authEvent.type;
    analytics.track(authEvent);
  } else if (!authEvent) {
    authEventRef.current = '';
  }

  // Get the user's timezone and store it in a cookie. This is used for LiveProfile, and it's nice
  // to be able to have it server-side
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    globalThis.window.document.cookie = `tz=${tz}; max-age=31536000`;
  }, []);

  const displayAdsScriptsConfig: DisplayAdsScriptsConfig =
    useMemo<DisplayAdsScriptsConfig>(
      () => ({
        enabled: user?.subscription?.type !== SubscriptionTypeEnum.PREMIUM,
        enabledBidders: config?.ads?.headerBidding.enabledBidders,
        sdks: config?.sdks,
        privacyOptOut: user?.privacy?.hasOptedOut ?? false,
      }),
      [
        user?.subscription?.type,
        user?.privacy?.hasOptedOut,
        config?.ads.headerBidding.enabledBidders,
        config?.sdks,
      ],
    );

  const playbackAdsScriptsConfig = useMemo(
    () => ({
      tritonScript: config?.ads.customAds.tritonScript,
      usPrivacy: CCPAUserPrivacy(user?.privacy?.usPrivacy ?? ''),
    }),
    [config?.ads.customAds.tritonScript, user?.privacy?.usPrivacy],
  );

  const headerBiddingConfig: HeaderBiddingConfig =
    useMemo<HeaderBiddingConfig>(() => {
      return {
        enabledBidders: config?.ads.headerBidding.enabledBidders,
        email: user?.email,
        emailHashes: user?.emailHashes,
        pubId: config?.sdks?.amazon?.pubId,
        privacyOptOut: user?.privacy?.hasOptedOut ?? false,
      };
    }, [
      config?.ads.headerBidding.enabledBidders,
      config?.sdks?.amazon?.pubId,
      user?.email,
      user?.emailHashes,
      user?.privacy?.hasOptedOut,
    ]);

  const ampClientConfig = useMemo(
    () => ({
      baseUrl: config.api.amp.clientEndpoint,
      hostName: config.environment.hosts.listen,
      profileId: user?.profileId,
      sessionId: user?.sessionId,
      userPrivacyOptOut: user?.privacy?.hasOptedOut,
      locale,
    }),
    [
      config.api.amp.clientEndpoint,
      config.environment.hosts.listen,
      locale,
      user?.profileId,
      user?.sessionId,
      user?.privacy?.hasOptedOut,
    ],
  );

  return (
    <>
      <GoogleAdsProvider
        enabled={
          Boolean(config?.ads?.flags?.display) &&
          user?.subscription?.type !== SubscriptionTypeEnum.PREMIUM
        }
        headerBiddingConfig={headerBiddingConfig}
      >
        <ConfigProvider value={config}>
          <AmpClientProvider options={ampClientConfig}>
            <WebApiClientProvider
              options={{ endpoint: config.api.radioEdit.webGraphQlEndpoint }}
            >
              <ThumbsProvider>
                <PresetsProvider>
                  <PresetsDrawerProvider>
                    <IsMobileContext value={isMobile}>
                      <AdsTargetingProvider visitNum={visitNum}>
                        {lsid => (
                          <MarketProvider>
                            <PlaybackProvider
                              adsEnabled={
                                Boolean(config?.ads?.flags.playback) &&
                                user?.subscription?.type !==
                                  SubscriptionTypeEnum.PREMIUM
                              }
                              anID={
                                config?.sdks?.ias?.enabled ?
                                  config?.sdks?.ias?.anID
                                : 0
                              }
                              apiConfig={{
                                baseUrl: config.api.amp.clientEndpoint,
                                hostName: config.environment.hosts.listen,
                                profileId: user?.profileId,
                                sessionId: user?.sessionId,
                                userPrivacyOptOut: user?.privacy?.hasOptedOut,
                                locale,
                              }}
                              dfpInstanceId={config.ads.dfpInstanceId}
                              environment="listen"
                              featureFlags={config.features}
                              lsid={lsid}
                              pageName={pageName}
                              subscriptionType={user?.subscription?.type}
                            >
                              <QueryClientProvider>
                                <SearchSessionProvider>
                                  <Analytics />
                                  <ClientOnly>
                                    {() => <GlobalToastRegion />}
                                  </ClientOnly>
                                  <FullScreenProvider
                                    isOpen={isFullScreenPlayerRoute}
                                  >
                                    <PageLayout>
                                      <Outlet />
                                    </PageLayout>
                                  </FullScreenProvider>
                                </SearchSessionProvider>
                              </QueryClientProvider>
                            </PlaybackProvider>
                          </MarketProvider>
                        )}
                      </AdsTargetingProvider>
                    </IsMobileContext>
                  </PresetsDrawerProvider>
                </PresetsProvider>
              </ThumbsProvider>
            </WebApiClientProvider>
          </AmpClientProvider>
        </ConfigProvider>
      </GoogleAdsProvider>
      {/* Moved ads scripts to body in order to speed up rendering of the Document shell */}
      {displayAdsScriptsConfig ?
        <DisplayAdsScripts
          enabled={displayAdsScriptsConfig.enabled}
          enabledBidders={displayAdsScriptsConfig.enabledBidders}
          language={getLanguageFromLocale(locale!) ?? 'en'}
          privacyOptOut={displayAdsScriptsConfig.privacyOptOut}
          sdks={displayAdsScriptsConfig.sdks}
        />
      : null}
      {playbackAdsScriptsConfig ?
        <PlaybackAdsScripts
          tritonScript={playbackAdsScriptsConfig.tritonScript}
          usPrivacy={playbackAdsScriptsConfig.usPrivacy}
        />
      : null}
    </>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const rootLoaderData = useRouteLoaderData<RootLoader>($routeId('root'));
  const navigate = useNavigate();

  const { newrelicScript, SHORT_COMMIT, appVersion, config } =
    rootLoaderData ?? {};

  const isIasEnabled = config?.sdks?.ias?.enabled ?? false;

  const scrollPos = useWindowScrollPosition();
  const elevateSearchBar = useElevateSearchBar();

  return (
    <ThemeProvider hint={rootLoaderData?.requestInfo.hints.theme}>
      <html
        data-scroll={scrollPos.y}
        data-search-bar-elevate={elevateSearchBar || undefined}
        lang="en"
      >
        <head>
          <meta charSet="utf-8" />
          <meta
            content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"
            name="viewport"
          />
          <meta content="yes" name="mobile-web-app-capable" />
          {newrelicScript ?
            <script
              dangerouslySetInnerHTML={{ __html: newrelicScript }}
              id="newrelic-browser-script"
            />
          : null}
          {isNonNullish(config?.sdks.jwPlayer?.script) && (
            <script
              defer
              id="jw-player-script"
              src={config?.sdks.jwPlayer?.script}
              type="text/javascript"
            />
          )}
          {isIasEnabled ?
            <script
              data-name="ias"
              defer
              src="https://static.adsafeprotected.com/vans-adapter-google-ima.js"
              type="text/javascript"
            />
          : null}
          <Meta />
          <Links />
        </head>
        {/* This is just how RouterProvider works – not much we can do about it */}
        {/* eslint-disable-next-line react-compiler/react-compiler */}
        <RouterProvider navigate={navigate} useHref={useAbsoluteHref}>
          <body
            data-commit={SHORT_COMMIT}
            data-version={appVersion}
            style={{ minHeight: '100dvh', display: 'flex' }}
          >
            <UserContextProvider>{children}</UserContextProvider>
            <ScrollRestoration />
            <Scripts />
          </body>
        </RouterProvider>
      </html>
    </ThemeProvider>
  );
}

export { AppErrorBoundary as ErrorBoundary } from '~app/components/error/app-error-boundary';
