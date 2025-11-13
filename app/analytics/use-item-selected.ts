import {
  type Analytics,
  eventType as EventType,
} from '@iheartradio/web.analytics';
import { useCallback } from 'react';
import { toSnakeCase } from 'remeda';
import type { Merge, SetOptional } from 'type-fest';

import { useAnalytics } from './create-analytics';

export type ItemSelectedType = {
  action?: string;
  assets: Merge<
    Analytics.Asset,
    { asset: SetOptional<Analytics.Asset['asset'], 'id'> }
  >;
  contentId?: number | string;
  contentTitle?: string;
  context?: string;
  globalStation?: Analytics.StationType;
  itemPosition: number;
  location?: string;
  pageName: string;
  row?: number;
  section?: string;
  sectionPosition?: number;
  tab?: string;
  sectionId?: number | string;
  tag?: string;
};

export function useItemSelected() {
  const analytics = useAnalytics();

  const onItemSelected = useCallback(
    ({
      action = EventType.enum.ItemSelected,
      assets,
      contentId,
      contentTitle,
      context,
      globalStation,
      itemPosition,
      location,
      pageName,
      row = 0,
      section,
      sectionPosition,
      tab,
      sectionId,
      tag,
    }: ItemSelectedType) => {
      analytics.track({
        type: EventType.enum.ItemSelected,
        data: {
          action,
          ...(typeof assets?.asset?.id === 'string' ?
            { station: { asset: { ...assets.asset, id: assets.asset.id } } }
          : {}),
          item: {
            asset: {
              ...(assets.asset.id || 'subid' in assets.asset ?
                {
                  id:
                    'subid' in assets.asset && assets.asset.subid ?
                      assets.asset.subid.toString()
                    : assets.asset.id?.split('|')[1],
                }
              : {}),
              name:
                'subname' in assets.asset && assets.asset.subname ?
                  assets.asset.subname
                : assets.asset.name,
            },
          },
          event: {
            location: location ?? `${pageName}|${section}|${context}`,
            type: context,
          },
          view: {
            pageName: toSnakeCase(pageName),
            sectionPosition,
            itemPosition,
            item: {
              column: itemPosition,
              row,
            },
            section: {
              name: section,
              ...(sectionId ? { id: sectionId } : {}),
              ...(tag ? { tag } : {}),
            },
            ...(tab ? { tab: toSnakeCase(tab) } : {}),
            ...(contentId || contentTitle ?
              { content: { id: contentId, title: contentTitle } }
            : {}),
            ...(globalStation ?
              {
                station: {
                  asset: globalStation,
                },
              }
            : {}),
          },
        },
      });
    },
    [analytics],
  );

  return { onItemSelected };
}
