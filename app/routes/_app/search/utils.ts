import { type Analytics, eventType } from '@iheartradio/web.analytics';
import { v4 as uuid } from 'uuid';
import type { z } from 'zod';

import { searchEvent } from '~app/analytics/search-event';
import { searchSuccess } from '~app/analytics/search-success';

import type { searchFilterSchema, SearchResult } from './schemas';
import { SearchFilter, SearchResultSchema, searchTypeEnum } from './schemas';

export const PodcastShowType = {
  Serial: 'serial',
  Episodic: 'episodic',
} as const;

export const getRequestFilters = (
  searchFilter: z.infer<typeof searchFilterSchema>,
) => {
  const all = searchFilter === SearchFilter.all;

  return {
    artist: all || searchFilter === SearchFilter.artists,
    bundle: all || searchFilter === SearchFilter.albums,
    playlist: all || searchFilter === SearchFilter.playlists,
    podcast: all || searchFilter === SearchFilter.podcasts,
    station: all || searchFilter === SearchFilter.live,
    track: all || searchFilter === SearchFilter.songs,
  };
};

export const parseSearchResult = (response: unknown): SearchResult => {
  const parsed = SearchResultSchema.parse(response);
  if (parsed.typeName === searchTypeEnum.enum.KEYWORDS) {
    parsed.isFavorites = parsed.webUrl?.endsWith('/favorites/');
  }
  return parsed;
};

export const parseBestMatch = (
  bestMatch: unknown,
  filterAnon = false,
): SearchResult | undefined => {
  const parsed = SearchResultSchema.optional().parse(bestMatch);

  if (parsed?.typeName === searchTypeEnum.enum.KEYWORDS) {
    parsed.isFavorites = parsed.webUrl?.endsWith('/favorites/');
    parsed.isMyPlaylist = parsed.webUrl?.endsWith('/playlist/my/');

    if (filterAnon && (parsed.isFavorites || parsed.isMyPlaylist)) {
      return undefined;
    }
  }
  return parsed;
};

export const stringifySearchParams = ({ searchParams }: URL): string => {
  try {
    return JSON.stringify(
      Array.from(searchParams.entries()).reduce(
        (accumulator, currentParam) => {
          if (currentParam[0] === 'q' || currentParam[0] === 'filter') {
            accumulator[currentParam[0]] = currentParam[1];
          }
          return accumulator;
        },
        {} as Record<string, string>,
      ),
    );
  } catch {
    // If `JSON.stringify` fails, return a random string
    return uuid();
  }
};

export function fireSearchEvent({
  filter,
  index = 0,
  queryId,
  searchTerm,
  sessionId,
  station,
  exitType = eventType.enum.ItemSelected,
}: {
  filter: string;
  index: number;
  queryId?: string | null;
  searchTerm: string;
  sessionId: string;
  station?: Analytics.Asset;
  exitType?: string;
}) {
  searchEvent({
    search: {
      screen: 'search',
      userSearchTerm: searchTerm,
      selectionCategory: filter,
      queryId: queryId ?? '',
      selectionCategoryPosition: index,
      exitType,
      sessionId,
    },
    ...(station && { station }),
  });
}

export function fireSearchSuccessEvent({
  filter,
  queryId,
  searchTerm,
  sessionId,
  station,
  type,
  section,
  row,
}: {
  filter: string;
  queryId: string;
  searchTerm: string;
  sessionId: string;
  station: Analytics.SearchSuccess['station'];
  type: string;
  section: string;
  row: number;
}) {
  searchSuccess({
    search: {
      sessionId,
      searchTerm,
      queryId,
    },
    view: {
      pageName: 'search',
      section: {
        name: section,
      },
      filter: {
        name: filter,
      },
      item: {
        row,
        column: 0,
      },
    },
    event: {
      type: 'search_bar',
    },
    asset: {
      type,
    },
    station: {
      asset: {
        id: station.asset.id,
        name: station.asset.name,
        ...(station?.asset?.sub ?
          {
            sub: {
              ...(station.asset.sub.id ? { id: station.asset.sub.id } : {}),
              ...(station.asset.sub.name ?
                { name: station.asset.sub.name }
              : {}),
            },
          }
        : {}),
      },
    },
  });
}
