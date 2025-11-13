import { slugify } from '@iheartradio/web.utilities/string/slugify';
import { isEmpty, isNonNullish, isTruthy } from 'remeda';

export const getLiveProfileSlug = (slugAndId?: string) => {
  if (!isTruthy(slugAndId)) {
    throw new Response(`Invalid Live Profile Slug: ${slugAndId}`, {
      status: 404,
    });
  }

  const slugArray = slugAndId.split('-');

  const maybeLiveId = Number.parseInt(slugArray.at(-1) || '');

  if (!Number.isInteger(maybeLiveId)) {
    throw new Response(`Invalid Live Profile Slug: ${slugAndId}`, {
      status: 404,
    });
  }

  const liveProfileId = Number.parseInt(slugArray.pop()!, 10);
  const slug = slugArray.join('-');

  return {
    liveProfileId,
    slug,
  };
};

export function makeLiveStationSlug(
  name: null | undefined,
  id: null | undefined,
): undefined;
export function makeLiveStationSlug(
  name: string | null | undefined,
  id: string | number | null | undefined,
): string;
export function makeLiveStationSlug(
  name: string | null | undefined,
  id: number | string | null | undefined,
): string | undefined {
  if (name == null && id == null) return undefined;

  const segments = [name ? slugify(name) : undefined, id].filter(isNonNullish);
  return isEmpty(segments) ? undefined : segments.join('-');
}
