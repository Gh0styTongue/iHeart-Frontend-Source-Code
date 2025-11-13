import { z } from 'zod';

import type { PodcastSortOrder } from './types';

export const podcastKeys = {
  all: ['podcasts'] as const,
  allEpisodes: () => [...podcastKeys.all, 'episode'] as const,
  followed: ['podcasts', 'followed'] as const,
  recs: ['podcasts', 'recs'] as const,
  categoriesWebAPI: (country: string, locale: string) =>
    [...podcastKeys.all, 'categories', 'webAPI', country, locale] as const,
  categoriesAMP: () => [...podcastKeys.all, 'categories', 'AMP'] as const,
  one: (id: number | string) => [...podcastKeys.all, String(id)] as const,
  oneEpisode: (episodeId: number) =>
    [...podcastKeys.all, 'episode', String(episodeId)] as const,
  category: (categoryId: string | number) =>
    [...podcastKeys.all, 'category', String(categoryId)] as const,
  networks: (countryCode: string, locale: string) => [
    ...podcastKeys.all,
    'networks',
    countryCode,
    locale,
  ],
  topics: (countryCode: string, locale: string) =>
    [...podcastKeys.all, 'topics', countryCode, locale] as const,
  isFollowing: (id: number | string) =>
    [...podcastKeys.one(String(id)), 'isFollowing'] as const,
  filterSort: (podcastId: number) =>
    [...podcastKeys.one(podcastId), 'filterSort'] as const,
  episodes: (podcastId: number, sortOrder: PodcastSortOrder | undefined) =>
    [...podcastKeys.one(podcastId), 'episodes', sortOrder] as const,
  episodesSearch: (podcastId: number, searchTerm: string) =>
    [...podcastKeys.one(podcastId), 'episodes', 'search', searchTerm] as const,
};

export const PodcastNetworkSchema = z.object({
  title: z.string(),
  img_uri: z.string(),
  link: z.object({
    urls: z.object({
      web: z.string(),
      device: z.string(),
    }),
  }),
});

export const PodcastTopicSchema = z.object({
  id: z.string(),
  catalog: z
    .object({
      id: z.string(),
    })
    .optional()
    .nullable(),
  title: z.string(),
  subtitle: z.string(),
  img_uri: z.string(),
  link: z.object({
    urls: z.object({
      web: z.string(),
      device: z.string(),
    }),
  }),
});
