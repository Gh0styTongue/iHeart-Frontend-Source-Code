import { slugify } from '@iheartradio/web.utilities/string/slugify';
import { isEmpty, isNonNullish, isTruthy } from 'remeda';

export const getPlaylistProfileSlug = (slugAndId?: string) => {
  if (!isTruthy(slugAndId)) {
    throw new Response(`Invalid Playlist Profile Slug: ${slugAndId}`, {
      status: 404,
    });
  }

  const slugArray = slugAndId.split('-');

  if (slugArray.length < 2) {
    throw new Response(`Invalid Playlist Profile Slug: ${slugAndId}`, {
      status: 404,
    });
  }

  const playlistId = slugArray.pop();
  const maybeUserId = slugArray.pop();

  if (!Number.isInteger(Number.parseInt(maybeUserId!, 10))) {
    throw new Response(`Invalid Playlist Profile Slug: ${slugAndId}`, {
      status: 404,
    });
  }

  const slug = slugArray.join('-');
  if (!isTruthy(playlistId) || !isTruthy(maybeUserId)) {
    throw new Response(`Invalid Playlist Profile Slug: ${slugAndId}`, {
      status: 404,
    });
  }

  return {
    playlistId,
    userId: Number(maybeUserId),
    slug,
  };
};

type MakePlaylistSlugParams = {
  name?: string;
  slug?: string;
  userId?: number | string;
  id?: string;
};

export function makePlaylistSlug(
  playlistProfile?: MakePlaylistSlugParams,
): string | undefined {
  if (!playlistProfile) return undefined;
  const { name, slug } = playlistProfile;
  let { userId, id } = playlistProfile;

  const nameOrSlug = name ?? slug;

  if (id?.includes('::')) {
    const splits = id.split('::');
    userId = splits.at(0)?.trim();
    id = splits.at(1)?.trim();
  }

  const segments = [
    nameOrSlug ? slugify(nameOrSlug) : undefined,
    userId,
    id,
  ].filter(isNonNullish);

  return isEmpty(segments) ? undefined : segments.join('-');
}
