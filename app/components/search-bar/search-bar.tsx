import { lightDark, vars } from '@iheartradio/web.accomplice';
import { Box } from '@iheartradio/web.accomplice/components/box';
import { Button } from '@iheartradio/web.accomplice/components/button';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import { useHydrated } from 'remix-utils/use-hydrated';

import type { RegGateContext } from '~app/analytics/data';
import { useUser } from '~app/contexts/user';
import { useLoginUrl, useSignUpUrl } from '~app/hooks/auth-urls';
import { useGetPageName } from '~app/hooks/use-get-page-name';
import { usePageDataAsset } from '~app/hooks/use-page-data-asset';
import { ANALYTICS_ORIGIN, stickyItems } from '~app/utilities/constants';

import { AuthSettings } from '../navigation';
import { SearchBox } from './search-box';

export function SearchBar() {
  const user = useUser();
  const pageName = useGetPageName();
  const asset = usePageDataAsset();
  const isHydrated = useHydrated();

  const regGateContext = {
    trigger: 'reg_button',
    origin: ANALYTICS_ORIGIN.LISTEN,
    location: 'header',
    pageName,
    assetId: asset?.id,
    assetName: asset?.name,
  } satisfies RegGateContext;

  const loginUrl = useLoginUrl({ context: regGateContext });
  const signUpUrl = useSignUpUrl({ context: regGateContext });

  return (
    <Box
      backgroundColor={lightDark(vars.color.gray100, vars.color.brandBlack)}
      display={{ mobile: 'none', large: 'flex' }}
      // height has been added here because other components top(sticky) property dependent on it
      height={stickyItems.desktopSearch}
      id="search-bar"
      justifyContent="space-between"
      paddingX={vars.space[32]}
      paddingY={vars.space[8]}
      position="sticky"
      right="0"
      top="0"
      transition="box-shadow 0.1s ease-in-out"
      width="100%"
      zIndex={vars.zIndex[2]}
    >
      <SearchBox />
      <Flex alignItems="center" gap={vars.space[16]}>
        {!isHydrated || user.isAnonymous ?
          <>
            <Button
              color="gray"
              css={{ whiteSpace: 'nowrap' }}
              data-test="sign-up"
              href={signUpUrl.toString()}
              kind="secondary"
              rel="nofollow"
              size="small"
            >
              Sign up
            </Button>
            <Button
              color="red"
              css={{ whiteSpace: 'nowrap' }}
              data-test="login"
              href={loginUrl.toString()}
              kind="primary"
              rel="nofollow"
              size="small"
            >
              Log in
            </Button>
          </>
        : <AuthSettings />}
      </Flex>
    </Box>
  );
}
