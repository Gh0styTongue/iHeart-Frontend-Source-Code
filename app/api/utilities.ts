import {
  type Amp,
  type ampContract,
  type ClientInferResponseBody,
  StationEnum,
} from '@iheartradio/web.api/amp';
import type { WebApi } from '@iheartradio/web.api/webapi';
import { slugify } from '@iheartradio/web.utilities/string/slugify';

export const unwrapSettled = <T>(result: PromiseSettledResult<T>): T | null =>
  result.status === 'rejected' ? null : result.value;

/**
 * Parses out an ID from a WebAPI "Card"
 * @param card - A "Card" object from WebAPI
 * @returns The parsed ID
 */
export const getCardId = (card?: Partial<WebApi.Card>) => {
  if (card?.catalog?.id) {
    return card.catalog.id;
  }

  if (!card?.link?.urls?.device) {
    return undefined;
  } else if (card?.link?.urls?.device) {
    const device = String(card?.link?.urls?.device);
    return device.split('/').at(-1);
  }

  return undefined;
};

/**
 * Parses out an ID from a WebAPI "Card"
 * @param card - A "Card" object from WebAPI
 * @returns The parsed ID with Slug
 */
export const getCardSlug = (card?: Partial<WebApi.Card>) => {
  if (!card?.title) return getCardId(card);

  if (card?.catalog?.id) {
    return `${slugify(card.title.replace('.', '').toLowerCase())}-${
      card.catalog.id
    }`;
  }

  if (!card?.link?.urls?.device) {
    return null;
  } else if (card?.link?.urls?.device) {
    const device = String(card?.link?.urls?.device);
    return `${slugify(card.title.replace('.', '').toLowerCase())}-${device
      .split('/')
      .at(-1)}`;
  }

  return null;
};

/**
 * Parses out a genre ID from a WebAPI "Card's" facet (API tag)
 * @param card - A "Card" object from WebAPI
 * @returns The parsed genre ID
 */
export const getGenreSlug = (card?: Partial<WebApi.Card>) => {
  const webUrl = card?.link?.urls?.web;

  if (!webUrl) return;

  const url = new URL(webUrl);
  return url.searchParams.get('facets')?.replace('playlist-genres/', '');
};

export const getFollowedLiveStations = (
  stationsResponse: ClientInferResponseBody<
    typeof ampContract.v2.playlists.getStations
  >,
) => {
  return (stationsResponse.hits ?? [])
    .filter(
      station => station.favorite && station.stationType === StationEnum.LIVE,
    )
    .map(stationHit => stationHit?.content?.at(0)) as Array<Amp.LiveResponse>;
};

export const getFavoritesRadio = (
  stationsResponse: ClientInferResponseBody<
    typeof ampContract.v2.playlists.getStations
  >,
) => {
  return stationsResponse.hits
    .filter(
      favoriteRadioHit =>
        favoriteRadioHit.favorite &&
        favoriteRadioHit.stationType === StationEnum.FAVORITES,
    )
    .at(0);
};
