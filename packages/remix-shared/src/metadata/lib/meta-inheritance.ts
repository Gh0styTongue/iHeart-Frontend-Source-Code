import { themeTokens } from '@iheartradio/web.accomplice';
import type { BaseConfig } from '@iheartradio/web.config';
import type { MetaDescriptor } from 'react-router';
import { isNonNullish } from 'remeda';

import {
  METADATA_APP_NAME,
  METADATA_DOMAIN,
  METADATA_TWITTER_HANDLE,
} from './constants.js';
import { type MetaDescriptorWithKey, generateMetaKey } from './utilities.js';

export function getRootInheritableMeta(
  config?: BaseConfig,
): MetaDescriptorWithKey[] {
  return [
    {
      content: METADATA_APP_NAME,
      property: 'og:site_name',
      key: generateMetaKey('property', 'og:site_name'),
    },
    {
      content: METADATA_DOMAIN,
      name: 'twitter:domain',
      key: generateMetaKey('name', 'twitter:domain'),
    },
    {
      content: METADATA_TWITTER_HANDLE,
      name: 'twitter:creator',
      key: generateMetaKey('name', 'twitter:creator'),
    },
    {
      content: METADATA_TWITTER_HANDLE,
      name: 'twitter:site',
      key: generateMetaKey('name', 'twitter:site'),
    },
    {
      content: METADATA_APP_NAME,
      name: 'twitter:app:name:iphone',
      key: generateMetaKey('name', 'twitter:app:name:iphone'),
    },
    {
      content: METADATA_APP_NAME,
      name: 'twitter:app:name:ipad',
      key: generateMetaKey('name', 'twitter:app:name:ipad'),
    },
    {
      content: METADATA_APP_NAME,
      name: 'twitter:app:name:googleplay',
      key: generateMetaKey('name', 'twitter:app:name:googleplay'),
    },
    {
      content: METADATA_APP_NAME,
      name: 'al:android:app_name',
      key: generateMetaKey('name', 'al:android:app_name'),
    },
    {
      content: METADATA_APP_NAME,
      name: 'al:ios:app_name',
      key: generateMetaKey('name', 'al:ios:app_name'),
    },
    {
      content: themeTokens.colors.brandRed,
      name: 'theme-color',
      key: generateMetaKey('name', 'theme-color'),
    },

    ...(config ?
      [
        config?.sdks?.facebook?.appId ?
          {
            content: config.sdks.facebook.appId,
            property: 'fb:app_id',
            key: generateMetaKey('property', 'fb:app_id'),
          }
        : null,
        config?.sdks?.facebook?.pages ?
          {
            content: config.sdks.facebook.pages,
            property: 'fb:pages',
            key: generateMetaKey('property', 'fb:pages'),
          }
        : null,

        config?.app?.appleId ?
          {
            content: config.app.appleId,
            name: 'twitter:app:id:iphone',
            key: generateMetaKey('name', 'twitter:app:id:phone'),
          }
        : null,
        config?.app?.appleId ?
          {
            content: config.app.appleId,
            name: 'twitter:app:id:ipad',
            key: generateMetaKey('name', 'twitter:app:id:ipad'),
          }
        : null,
        config?.app?.appleId ?
          {
            content: config.app.appleId,
            name: 'al:ios:app_store_id',
            key: generateMetaKey('name', 'al:ios:app_store_id'),
          }
        : null,
        config?.app?.googlePlayId ?
          {
            content: config.app.googlePlayId,
            name: 'twitter:app:id:googleplay',
            key: generateMetaKey('name', 'twitter:app:id:googleplay'),
          }
        : null,
        config?.app?.googlePlayId ?
          {
            content: config.app.googlePlayId,
            name: 'al:android:package',
            key: generateMetaKey('name', 'al:android:package'),
          }
        : null,
      ].filter(isNonNullish)
    : []),
  ];
}

const metaMap = new Map<string, MetaDescriptor | MetaDescriptorWithKey>();
function setDescriptor(descriptor: MetaDescriptor | MetaDescriptorWithKey) {
  try {
    const key =
      ((Reflect.get(descriptor, 'key', descriptor) ??
        Reflect.get(descriptor, 'name', descriptor) ??
        Reflect.get(descriptor, 'itemprop', descriptor) ??
        Reflect.get(descriptor, 'property', descriptor)) as
        | string
        | undefined) ?? JSON.stringify(descriptor);

    metaMap.set(key, descriptor);
  } catch (error: unknown) {
    console.warn(
      error instanceof Error ? error.message : JSON.stringify(error),
    );
  }
}

/**
 * In React Router v7, child routes completely replace parent meta instead of merging.
 * This implementation merges parent meta with all child meta
 * https://github.com/remix-run/react-router/discussions/12672#discussioncomment-12211998
 */
export const mergeMeta = <TMetaArgs extends { matches: any[] }>(
  args: TMetaArgs,
  descriptors: MetaDescriptor[],
): MetaDescriptor[] => {
  metaMap.clear();

  // Parent meta
  const matchDescriptors = args.matches
    .filter(Boolean)
    .flatMap(({ meta }) => meta)
    .toReversed();

  for (const descriptor of matchDescriptors) {
    setDescriptor(descriptor);
  }

  // Leaf meta
  for (const descriptor of descriptors) {
    setDescriptor(descriptor);
  }

  return [...metaMap.values()];
};
