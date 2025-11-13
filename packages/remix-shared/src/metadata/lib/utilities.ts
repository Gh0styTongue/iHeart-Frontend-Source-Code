import type { MetaDescriptor } from 'react-router';
import { isNonNullish, truncate } from 'remeda';
import { z } from 'zod';

import {
  METADATA_AUDIO_TYPE,
  METADATA_DESCRIPTION_LENGTH,
  METADATA_LINK_REL_VALUES,
  METADATA_VIDEO_TYPE,
} from './constants.js';

export type MetaDescriptorWithKey = MetaDescriptor & { key: string };

export function sanitizeDescription(value: unknown) {
  if (typeof value !== 'string') {
    return value;
  }
  return truncate(
    // IHRWEB-16146 description could contain HTML with double-quote characters. Need to remove these to prevent breaking meta tags.
    value.trim().replaceAll('"', "'"),
    METADATA_DESCRIPTION_LENGTH,
    { separator: ' ' },
  );
}

// Meta tags are unique by name, property, itemprop, or title
// generate a key for each meta tag that is used when merging meta tags from multiple route matches
export const generateMetaKey = (
  attributeName: string,
  value: string,
): string => {
  return `meta-${attributeName}-${value}`;
};

const OpenGraphTagsSchema = z.object({
  title: z.string().optional(),
  description: z.preprocess(sanitizeDescription, z.string()).optional(),
  type: z.string().optional(),
  image: z.string().optional(),
});

type OpenGraphTagsData = z.infer<typeof OpenGraphTagsSchema>;

const openGraphTags = (data: OpenGraphTagsData): MetaDescriptorWithKey[] => {
  const result = OpenGraphTagsSchema.safeParse(data);

  if (result.success) {
    return Object.entries(result.data)
      .map(
        ([key, value]) =>
          (value ?
            {
              content: value,
              property: `og:${key}`,
              key: generateMetaKey('property', `og:${key}`),
              tagName: 'meta',
            }
          : undefined) as MetaDescriptorWithKey,
      )
      .filter(item => isNonNullish(item));
  }

  return [];
};

const TwitterTagsSchema = z.object({
  title: z.string().optional(),
  description: z.preprocess(sanitizeDescription, z.string()).optional(),
  type: z.string().optional(),
  card: z.string().optional(),
  image: z.string().optional(),
});

type TwitterTagsData = z.infer<typeof TwitterTagsSchema>;

const twitterTags = (data: TwitterTagsData): MetaDescriptorWithKey[] => {
  const result = TwitterTagsSchema.safeParse(data);

  if (result.success) {
    const twitterMeta = Object.entries(result.data)
      .map(
        ([key, value]) =>
          (value ?
            {
              content: value,
              name: `twitter:${key}`,
              key: generateMetaKey('name', `twitter:${key}`),
              tagName: 'meta',
            }
          : undefined) as MetaDescriptorWithKey,
      )
      .filter(isNonNullish);

    return twitterMeta;
  }

  return [];
};

const ItemPropTagsSchema = z.object({
  title: z.string().optional(),
  description: z.preprocess(sanitizeDescription, z.string()).optional(),
  image: z.string().optional(),
});

type ItemPropTagsData = z.infer<typeof ItemPropTagsSchema>;

const itemPropTags = (data: ItemPropTagsData): MetaDescriptorWithKey[] => {
  const result = ItemPropTagsSchema.safeParse(data);

  if (result.success) {
    const { title, description, image } = result.data;
    return [
      title ?
        {
          content: title,
          itemProp: 'name',
          key: generateMetaKey('itemprop', 'name'),
          tagName: 'meta',
        }
      : undefined,
      description ?
        {
          content: description,
          itemProp: 'description',
          key: generateMetaKey('itemprop', 'description'),
          tagName: 'meta',
        }
      : undefined,
      image ?
        {
          content: image,
          itemProp: 'image',
          key: generateMetaKey('itemprop', 'image'),
          tagName: 'meta',
        }
      : undefined,
    ].filter(isNonNullish);
  }

  return [];
};

const MediaTagsSchema = z.object({
  playerUrl: z.string().optional(),
  secureUrl: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
});
type MediaTagsData = z.infer<typeof MediaTagsSchema>;

const mediaTags = (data: MediaTagsData): MetaDescriptorWithKey[] => {
  const result = MediaTagsSchema.safeParse(data);

  if (result.success) {
    const { playerUrl, secureUrl, width, height } = result.data;
    return [
      width ?
        {
          content: width,
          name: 'twitter:player:width',
          key: generateMetaKey('name', 'twitter:player:width'),
          tagName: 'meta',
        }
      : undefined,
      height ?
        {
          content: height,
          name: 'twitter:player:height',
          key: generateMetaKey('name', 'twitter:player:height'),
          tagName: 'meta',
        }
      : undefined,
      playerUrl ?
        {
          content: playerUrl,
          name: 'twitter:player',
          key: generateMetaKey('name', 'twitter:player'),
          tagName: 'meta',
        }
      : undefined,
      playerUrl ?
        {
          content: playerUrl,
          property: 'og:audio',
          key: generateMetaKey('property', 'og:audio'),
          tagName: 'meta',
        }
      : undefined,
      {
        content: METADATA_AUDIO_TYPE,
        property: 'og:audio:type',
        key: generateMetaKey('property', 'og:audio:type'),
        tagName: 'meta',
      },
      {
        content: METADATA_VIDEO_TYPE,
        property: 'og:video:type',
        key: generateMetaKey('property', 'og:video:type'),
        tagName: 'meta',
      },
      secureUrl ?
        {
          content: secureUrl,
          property: 'og:video:url',
          key: generateMetaKey('property', 'og:video:url'),
          tagName: 'meta',
        }
      : undefined,
      secureUrl ?
        {
          content: secureUrl,
          property: 'og:video:secure_url',
          key: generateMetaKey('property', 'og:video:secrure_url'),
          tagName: 'meta',
        }
      : undefined,
    ].filter(isNonNullish);
  }

  return [];
};

const AppUrlTagsSchema = z.object({ url: z.string().optional() });
type AppUrlTagsData = z.infer<typeof AppUrlTagsSchema>;

const appUrlTags = (data: AppUrlTagsData): MetaDescriptorWithKey[] => {
  const result = AppUrlTagsSchema.safeParse(data);

  if (result.success) {
    const { url } = result.data;
    return url ?
        [
          {
            content: url,
            name: 'twitter:app:url:iphone',
            key: generateMetaKey('name', 'twitter:app:url:iphone'),
            tagName: 'meta',
          },
          {
            content: url,
            name: 'twitter:app:url:ipad',
            key: generateMetaKey('name', 'twitter:app:url:ipad'),
            tagName: 'meta',
          },
          {
            content: url,
            name: 'twitter:app:url:googleplay',
            key: generateMetaKey('name', 'twitter:app:url:googleplay'),
            tagName: 'meta',
          },
          {
            content: url,
            property: 'al:ios:url',
            key: generateMetaKey('property', 'al:ios:url'),
            tagName: 'meta',
          },
          {
            content: url,
            property: 'al:android:url',
            key: generateMetaKey('property', 'al:android:url'),
            tagName: 'meta',
          },
        ]
      : [];
  }

  return [];
};

const BaseTagsSchema = z.object({
  title: z.string().optional(),
  description: z.preprocess(sanitizeDescription, z.string()).optional(),
  keywords: z.string().optional(),
  image: z.string().optional(),
  canonicalUrl: z.string().url().optional(),
  noFollow: z.boolean().optional(),
});
type BaseTagsData = z.infer<typeof BaseTagsSchema>;

const baseTags = (data: BaseTagsData): MetaDescriptorWithKey[] => {
  const result = BaseTagsSchema.safeParse(data);

  if (result.success) {
    const { title, description, keywords, image, canonicalUrl, noFollow } =
      result.data;
    return [
      title ? { title, key: generateMetaKey('name', 'title') } : undefined,
      description ?
        {
          content: description,
          name: 'description',
          key: generateMetaKey('name', 'description'),
          tagName: 'meta',
        }
      : undefined,
      image ?
        {
          content: image,
          name: 'thumbnail',
          key: generateMetaKey('name', 'thumbnail'),
          tagName: 'meta',
        }
      : undefined,
      image ?
        {
          href: image,
          rel: METADATA_LINK_REL_VALUES.ImageSource, // tfg was what was causing hydration errors. Was `name`, needed to be `rel` [DEM 2025/06/03]
          key: generateMetaKey('name', 'imageSource'),
          tagName: 'link',
        }
      : undefined,
      keywords ?
        {
          content: keywords,
          name: 'keywords',
          key: generateMetaKey('name', 'keywords'),
          tagName: 'meta',
        }
      : undefined,
      canonicalUrl ?
        {
          href: canonicalUrl,
          rel: METADATA_LINK_REL_VALUES.Canonical,
          key: generateMetaKey('rel', 'canonical'),
          tagName: 'link',
        }
      : undefined,
      noFollow ?
        {
          content: 'noindex, nofollow',
          name: 'robots',
          key: generateMetaKey('name', 'robots'),
          tagName: 'meta',
        }
      : undefined,
    ].filter(isNonNullish);
  }

  return [];
};

type MetadataTagsBySchemaData =
  | BaseTagsData
  | AppUrlTagsData
  | MediaTagsData
  | ItemPropTagsData
  | TwitterTagsData
  | OpenGraphTagsData;

export const metadataTagsBySchema: Record<
  string,
  (data: MetadataTagsBySchemaData) => MetaDescriptorWithKey[]
> = {
  openGraph: data => openGraphTags(data as OpenGraphTagsData),
  twitter: data => twitterTags(data as TwitterTagsData),
  itemProp: data => itemPropTags(data as ItemPropTagsData),
  media: data => mediaTags(data as MediaTagsData),
  app: data => appUrlTags(data as AppUrlTagsData),
  base: data => baseTags(data as BaseTagsData),
};

export const setBasicMetadata = (
  data: MetadataTagsBySchemaData,
): MetaDescriptorWithKey[] => {
  const { base, openGraph, twitter, itemProp } = metadataTagsBySchema;
  return [
    ...base(data as BaseTagsData),
    ...openGraph(data as OpenGraphTagsData),
    ...twitter(data as TwitterTagsData),
    ...itemProp(data as ItemPropTagsData),
  ];
};

export const setSocialTitle = (title: string): MetaDescriptorWithKey[] => {
  return [
    {
      content: title,
      property: 'og:title',
      key: generateMetaKey('property', 'og:title'),
      tagName: 'meta',
    },
    {
      content: title,
      name: 'twitter:title',
      key: generateMetaKey('name', 'twitter:title'),
      tagName: 'meta',
    },
    {
      content: title,
      itemProp: 'name',
      key: generateMetaKey('itemprop', 'name'),
      tagName: 'meta',
    },
  ];
};
