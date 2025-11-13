import type { QueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { prop } from 'remeda';

import { amp } from '~app/api/amp-client';

import { artistKeys } from './constants';

const getArtist = async (artistId: number | string) => {
  const { body } = await amp.api.v3.artists.getArtistProfile({
    params: { id: artistId },
  });

  return body;
};

export function useArtistQuery(artistId: number | string) {
  const result = useQuery({
    queryKey: artistKeys.one(artistId),
    queryFn: async () => await getArtist(artistId),
  });

  return result.data;
}

export async function getQueryDataArtist({
  artistId,
  queryClient,
}: {
  artistId: number | string;
  queryClient: QueryClient;
}) {
  return await queryClient.ensureQueryData({
    queryKey: artistKeys.one(artistId),
    queryFn: async () => await getArtist(artistId),
  });
}

const getArtistStation = async ({
  artistId,
  profileId,
}: {
  artistId: number;
  profileId: number;
}) =>
  await amp.api.v2.playlists
    .getStationBySeedId({
      params: { seedId: artistId, type: 'ARTIST', profileId },
    })
    .then(prop('body'))
    .then(prop('value'));

export function useQueryArtistStation({
  artistId,
  profileId,
}: {
  artistId: string | number;
  profileId: number;
}) {
  return useQuery({
    queryKey: artistKeys.station(artistId),
    queryFn: () => getArtistStation({ artistId: Number(artistId), profileId }),
  });
}

export async function getQueryDataArtistStation({
  artistId,
  profileId,
  queryClient,
}: {
  artistId: string | number;
  profileId: number;
  queryClient: QueryClient;
}) {
  return await queryClient.ensureQueryData({
    queryKey: artistKeys.station(artistId),
    queryFn: () => getArtistStation({ artistId: Number(artistId), profileId }),
  });
}
