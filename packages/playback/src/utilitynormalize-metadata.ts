import type { QueueItem } from './player:schemas.js';

export function normalizeMetadata({
  artistId,
  artistName,
  trackId,
  trackName,
}: {
  artistId: number | string;
  artistName: string;
  trackId: number | string;
  trackName: string;
}): QueueItem['meta'] {
  const normalizedArtistId =
    Number(artistId) > 0 ? Number(artistId) : undefined;
  const normalizedTrackId = Number(trackId) > 0 ? Number(trackId) : undefined;

  const artistImage =
    normalizedArtistId && normalizedArtistId > 0 ?
      `https://i.iheart.com/v3/catalog/artist/${normalizedArtistId}?ops=cover(400,400)`
    : '';

  const trackImage =
    normalizedTrackId && normalizedTrackId > 0 ?
      `https://i.iheart.com/v3/catalog/track/${normalizedTrackId}?ops=cover(400,400)`
    : '';

  return {
    artistId: normalizedArtistId,
    artistImage,
    artistName,
    description: artistName,
    image: trackImage || artistImage,
    subtitle: undefined,
    title: trackName,
    trackId: normalizedTrackId,
    trackImage,
    trackName,
  } as const;
}
