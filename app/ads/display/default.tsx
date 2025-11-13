import { Box } from '@iheartradio/web.accomplice/components/box';
import { Link } from '@iheartradio/web.accomplice/components/link';

import { useAppsFlyer } from '~app/hooks/use-apps-flyer';

export function DefaultNavAd() {
  const appsFlyer = useAppsFlyer();
  return (
    <Link onPress={() => appsFlyer?.generateLink()} target="_blank">
      <Box
        backgroundImage="url(https://www.iheart.com/public/listen/ad-fallback-nav.png)"
        backgroundSize="cover"
        height="250px"
        width="300px"
      />
    </Link>
  );
}

export function DefaultLeaderboardAd({ isMedium }: { isMedium: boolean }) {
  const appsFlyer = useAppsFlyer();
  return (
    <Link onPress={() => appsFlyer?.generateLink()} target="_blank">
      {isMedium ?
        <Box
          backgroundImage="url(https://www.iheart.com/public/listen/ad-fallback-tablet.png)"
          backgroundSize="cover"
          height="90px"
          width="728px"
        />
      : <Box
          backgroundImage="url(https://www.iheart.com/public/listen/ad-fallback-mobile.png)"
          backgroundSize="cover"
          height="50px"
          width="320px"
        />
      }
    </Link>
  );
}
