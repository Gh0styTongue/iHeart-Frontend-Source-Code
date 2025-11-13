import { vars } from '@iheartradio/web.accomplice';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import { SearchField } from '@iheartradio/web.accomplice/components/search-field';
import { debounce } from '@iheartradio/web.utilities/timing';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  useLoaderData,
  useLocation,
  useMatches,
  useNavigate,
  useNavigation,
  useNavigationType,
  useSearchParams,
} from 'react-router';
import { isNonNullish } from 'remeda';
import { $path } from 'safe-routes';
import { v4 as uuid } from 'uuid';

import { searchOpen } from '~app/analytics/search-open';
import { searchStart } from '~app/analytics/search-start';
import { useSearchSessionContext } from '~app/contexts/search-session';
import { useUser } from '~app/contexts/user';
import { useGetPageName } from '~app/hooks/use-get-page-name';
import { useNavigateAway } from '~app/hooks/use-navigate-away';
import type { SearchLoader } from '~app/routes/_app/search/.server/loader';
import { fireSearchEvent } from '~app/routes/_app/search/utils';
import type { RouteHandle } from '~app/types';
import { Routes } from '~app/utilities/constants';

export type LocationState = {
  prevPage?: string;
  searchSessionId?: string;
};

const debouncer = debounce(
  ({
    value,
    setSearchParams,
    state,
    anon,
  }: {
    value: string;
    setSearchParams: ReturnType<typeof useSearchParams>[1];
    state: ReturnType<typeof useLocation>['state'];
    anon: boolean;
  }) => {
    setSearchParams(
      prevParams => {
        if (value) {
          prevParams.set('q', value as string);
          if (anon) {
            prevParams.set('a', '1');
          }
        } else {
          prevParams.delete('a');
          prevParams.delete('q');
          prevParams.delete('filter');
        }
        return prevParams;
      },
      { replace: true, state },
    );
  },
  { timing: 'trailing', waitMs: 500 },
);

export function SearchBox() {
  const matches = useMatches();
  const hideSearch = useMemo(() => {
    for (const match of matches) {
      if (
        match.handle &&
        (match.handle as RouteHandle).hideGlobalSearch === true
      ) {
        return true;
      }
    }
    return false;
  }, [matches]);

  return useMemo(
    () => <SearchBoxComponent showSearch={!hideSearch} />,
    [hideSearch],
  );
}

function SearchBoxComponent({ showSearch }: { showSearch: boolean }) {
  const { filter, queryId, searchTerm } = useLoaderData<SearchLoader>();
  const navigate = useNavigate();
  const { isAnonymous = true } = useUser() ?? {};

  const searchSession = useSearchSessionContext();

  const location = useLocation();
  const [searchParam, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const navigationType = useNavigationType();
  const isSearching = useMemo(
    () =>
      navigation.state === 'loading' &&
      navigation.location.pathname === location.pathname &&
      navigation.location.pathname === '/search' &&
      navigation.location.search !== location.search,
    [
      location.pathname,
      location.search,
      navigation.location?.pathname,
      navigation.location?.search,
      navigation.state,
    ],
  );

  // Using a controlled version of `<Input />` so that when the close button
  // is clicked, we can clear the input value. Using `inputRef.current.value = ''` will not work
  // for some reason I cannot figure out [DEM 2025/03/07]
  const [query, setQuery] = useState(searchParam.get('q') ?? searchTerm);

  const doSearch = useCallback(
    (value: string) => {
      if (location.pathname === Routes.Search) {
        debouncer.call({
          value,
          setSearchParams,
          state: location.state,
          anon: isAnonymous,
        });
      }
    },
    [location.pathname, location.state, setSearchParams, isAnonymous],
  );

  const updateQuery = useCallback(
    (value: string) => {
      setQuery(value);
      doSearch(value);
    },
    [doSearch],
  );

  const pageName = useGetPageName();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (
      navigation.location?.pathname === Routes.Search &&
      isNonNullish(navigation.location.state) &&
      navigation.location.state.searchOpen
    ) {
      searchSession.set('open', true);
    } else if (
      isNonNullish(navigation.location) &&
      isNonNullish(navigation.location.state?.searchSessionId)
    ) {
      searchSession.set('sessionId', navigation.location.state.searchSessionId);
    }
  }, [navigation.location, searchSession]);

  // Retain the search query in the search box after navigating back using browser back button
  useEffect(() => {
    if (navigationType === 'POP') {
      setQuery(searchParam.get('q') ?? '');
    }
  }, [navigationType, searchParam]);

  useNavigateAway(
    Routes.Search,
    () => {
      searchEventHandler('Close');
      setQuery('');
      searchInputRef.current?.blur();
      searchSession.serialize({
        open: false,
        start: false,
        sessionId: uuid(),
      });
    },
    searchSession.get('open') ||
      navigationType === 'POP' ||
      navigationType === 'PUSH',
  );

  const searchEventHandler = useCallback(
    (exitType: string) =>
      fireSearchEvent({
        filter,
        index: 0,
        queryId,
        searchTerm,
        exitType,
        sessionId: searchSession.get('sessionId'),
      }),
    [filter, queryId, searchTerm, searchSession],
  );

  const searchNavigationHandler = useCallback(() => {
    if (!searchSession.get('open')) {
      const sessionId = uuid();
      searchSession.serialize({
        ...searchSession.deserialize(),
        open: true,
        sessionId,
      });
      searchOpen({
        search: {
          sessionId,
        },
        view: {
          pageName: pageName === '/' ? 'home' : pageName,
        },
        event: {
          location: 'header',
        },
      });
    }
    if (searchSession.get('sessionId') && !searchSession.get('start')) {
      searchSession.set('start', true);

      searchStart({
        search: {
          sessionId: searchSession.get('sessionId'),
        },
        view: {
          pageName: pageName === '/' ? 'home' : pageName,
        },
        event: {
          type: 'search_bar',
          action: 'click',
        },
      });
    }
    if (location.pathname !== Routes.Search) {
      navigate($path(Routes.Search), {
        state: {
          prevPage: location.pathname,
          searchSessionId: searchSession.get('sessionId'),
        },
      });
    }
  }, [location.pathname, navigate, pageName, searchSession]);

  return (
    <Flex
      alignItems="center"
      direction="row"
      flexShrink={1}
      gap="$32"
      justifyContent={showSearch ? 'flex-start' : 'flex-end'}
      marginRight={vars.space[16]}
      width="100%"
    >
      <SearchField
        aria-label="Search"
        isLoading={isSearching}
        name="q"
        onChange={updateQuery}
        onClear={() => searchEventHandler('Clear')}
        onFocus={searchNavigationHandler}
        placeholder="What do you want to listen to?"
        ref={searchInputRef}
        value={query}
      />
    </Flex>
  );
}
