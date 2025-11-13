import { slugify } from '@iheartradio/web.utilities/string/slugify';
import { isEmpty, isNonNullish, isNullish, isTruthy } from 'remeda';

export const getPodcastProfileSlug = (slugAndId?: string) => {
  if (!slugAndId || isEmpty(slugAndId)) {
    throw new Response(`Invalid Podcast Profile Slug: ${slugAndId}`, {
      status: 404,
    });
  }

  const slugArray = slugAndId.split('-');

  const podcastId = slugArray.pop();
  const slug = slugArray.join('-');

  if (
    isNullish(podcastId) ||
    !Number.isInteger(Number.parseInt(podcastId, 10))
  ) {
    throw new Response(`Invalid Podcast Profile Slug: ${slugAndId}`, {
      status: 404,
    });
  }

  return {
    podcastId: Number.parseInt(podcastId, 10),
    slug,
  };
};

export const getPodcastSlugFromWebLink = (url?: string | null): string => {
  if (isTruthy(url)) {
    try {
      const webLink = new URL(url);
      const slug = webLink.pathname
        .split('/')
        .filter(v => v !== '')
        .at(-1);
      if (isTruthy(slug)) {
        const slugArray = slug.split('-');
        slugArray.pop();
        return slugArray.join('-');
      } else {
        return '';
      }
    } catch {
      return '';
    }
  } else {
    return '';
  }
};

export function makePodcastSlug(
  name: null | undefined,
  id: null | undefined,
): undefined;
export function makePodcastSlug(
  name: string | null | undefined,
  id: number | string | null | undefined,
): string;
export function makePodcastSlug(
  name: string | null | undefined,
  id: number | string | null | undefined,
) {
  const segments = [name ? slugify(name) : undefined, id].filter(isNonNullish);
  return isEmpty(segments) ? undefined : segments.join('-');
}
