import { stationAsset } from '@iheartradio/web.analytics';
import { useMatches } from 'react-router';
import type { z } from 'zod';

export type PageData = { asset?: z.infer<typeof stationAsset> };
export type LoaderDataWithPageData = { pageData?: PageData };

export function usePageDataAsset() {
  const matches = useMatches();

  const closestMatch = matches.at(-1);
  const asset = (closestMatch?.data as LoaderDataWithPageData)?.pageData?.asset;

  if (!asset) {
    return undefined;
  }

  const { success, data, error } = stationAsset.safeParse(asset);

  if (error) {
    console.warn('Error parsing pageData.asset:', error);
  }

  return success ? data : undefined;
}
