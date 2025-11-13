import {
  type Analytics,
  eventType as EventType,
} from '@iheartradio/web.analytics';
import { debounce } from '@iheartradio/web.utilities/timing';
import { useCallback, useEffect, useMemo } from 'react';
import { isNonNullish, pickBy, toSnakeCase } from 'remeda';

import { useAnalytics } from './create-analytics';

// Debouncing the actual tracking function so that re-renders do not trigger more than
// one (hopefully) analytics call [DEM 2024/12/20]
const doPageView = debounce(
  (
    analytics: Analytics.Analytics,
    pageName: Analytics.PageView['pageName'],
    href: string,
    pageData?: Analytics.PageView['view'],
  ) => {
    analytics.track({
      type: EventType.enum.PageView,
      data: {
        pageName: toSnakeCase(pageName ?? ''),
        ...pickBy({ view: pageData }, isNonNullish),
        window: {
          location: {
            href,
          },
        },
      },
    });
  },
  { timing: 'trailing', waitMs: 500 },
);

export function usePageView(
  pageName: Analytics.PageView['pageName'],
  _pageData?: Analytics.PageView['view'],
) {
  const analytics = useAnalytics();

  const buildPageData = useCallback(
    (_pageData?: Analytics.PageView['view']) => {
      return _pageData?.asset?.id || _pageData?.tab ?
          {
            ...(_pageData?.asset?.id ?
              {
                asset: {
                  id: _pageData.asset.id,
                  name: _pageData.asset.name,
                  ...(_pageData?.asset.sub?.id && _pageData.asset.sub.name ?
                    {
                      sub: {
                        id: _pageData.asset.sub.id,
                        name: _pageData.asset.sub.name,
                      },
                    }
                  : {}),
                },
              }
            : {}),
            ...(_pageData?.tab ?
              { tab: toSnakeCase(_pageData.tab ?? '') }
            : {}),
          }
        : undefined;
    },
    [],
  );

  // This complex memoization is done so that each of the constituents of `pageData` are compared
  // only at the primitive level. This memoized value is then passed in the dependency array of
  // the Effect below
  const initialPageData: Analytics.PageView['view'] = useMemo(
    () =>
      _pageData?.asset?.id || _pageData?.tab ?
        {
          ...(_pageData?.asset?.id ?
            {
              asset: {
                id: _pageData.asset.id,
                name: _pageData.asset.name,
                ...(_pageData?.asset.sub?.id && _pageData.asset.sub.name ?
                  {
                    sub: {
                      id: _pageData.asset.sub.id,
                      name: _pageData.asset.sub.name,
                    },
                  }
                : {}),
              },
            }
          : {}),
          ...(_pageData?.tab ? { tab: toSnakeCase(_pageData.tab ?? '') } : {}),
        }
      : undefined,
    [
      _pageData?.asset?.id,
      _pageData?.asset?.name,
      _pageData?.asset?.sub?.id,
      _pageData?.asset?.sub?.name,
      _pageData?.tab,
    ],
  );

  useEffect(() => {
    doPageView.call(analytics, pageName, window.location.href, initialPageData);
  }, [analytics, pageName, initialPageData]);

  /**
   * There are instances where we need to record a page view manually (e.g., when
   * filter values change on Live Directory). So returning a callback from this hook
   * so that it can be triggered manually inside a component/route.
   *
   * Most of the time you will NOT need to use this [DEM 2025/09/11]
   */
  const trackPageView = useCallback(
    (
      pageName: Analytics.PageView['pageName'],
      _pageData?: Analytics.PageView['view'],
    ) => {
      if (!window || !window.location || !window.location.href) {
        return;
      }
      doPageView.call(
        analytics,
        pageName,
        window.location.href,
        buildPageData(_pageData),
      );
    },
    [analytics, buildPageData],
  );

  return { trackPageView };
}
