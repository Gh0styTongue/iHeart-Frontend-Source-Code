import { slugify } from '@iheartradio/web.utilities/string/slugify';
import { isEmpty, isNonNullish, isTruthy } from 'remeda';

export const getAlbumProfileSlug = (slugAndId?: string) => {
  if (!isTruthy(slugAndId)) {
    throw new Response(`Invalid Album Profile Slug: ${slugAndId}`, {
      status: 404,
    });
  }

  const slugArray = slugAndId.split('-');

  const maybeArtistId = Number.parseInt(slugArray.at(-1) || '');

  if (!Number.isInteger(maybeArtistId)) {
    throw new Response(`Invalid Album Profile Slug: ${slugAndId}`, {
      status: 404,
    });
  }

  const albumId = Number.parseInt(slugArray.pop()!, 10);
  const slug = slugArray.join('-');

  return {
    albumId,
    slug,
  };
};

export function makeAlbumSlug(
  name: null | undefined,
  id: null | undefined,
): undefined;
export function makeAlbumSlug(
  name: string | null | undefined,
  id: number | string | null | undefined,
): string;
export function makeAlbumSlug(
  name: string | null | undefined,
  id: number | string | null | undefined,
): string | undefined {
  const segments = [name ? slugify(name) : undefined, id].filter(isNonNullish);
  return isEmpty(segments) ? undefined : segments.join('-');
}
