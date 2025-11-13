import * as Analytics from '@iheartradio/web.analytics';

import { useAnalytics } from './create-analytics';

export type FollowUnFollowType = {
  pageName: string;
  section?: string;
  context: string;
  assets: Analytics.Analytics.Asset;
  type: string;
};

export function useFollowUnfollowEvent() {
  const analytics = useAnalytics();

  const onFollowUnfollow = ({
    pageName,
    section,
    context,
    assets,
    type,
  }: FollowUnFollowType) => {
    analytics.track({
      type: Analytics.eventType.enum.FollowUnfollow,
      data: {
        station: {
          asset: assets.asset,
          savedType: type,
        },
        event: {
          location:
            section ?
              `${pageName}|${section}|${context}`
            : `${pageName}|${context}`,
        },
      },
    });
  };

  return { onFollowUnfollow };
}
