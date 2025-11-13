import { invariant } from '@epic-web/invariant';
import { isServer } from '@iheartradio/web.api';
import { type AmpClientOptions, AmpClient } from '@iheartradio/web.api/amp';
import { ApiTokenCookieJar } from '@iheartradio/web.remix-shared/isomorphic';
import { createContext, use, useMemo, useRef } from 'react';

import { useUser } from '~app/contexts/user';

export type { AmpClient } from '@iheartradio/web.api/amp';

const { serialize } = ApiTokenCookieJar;

const AmpClientContext = createContext<AmpClient | null>(null);

const DefaultAmpClientOptions: AmpClientOptions = {
  profileId: undefined,
  sessionId: undefined,
  throwOnUnknownStatus: true,
  throwOnErrorStatus: true,
  tokenCookieSerializer: serialize,
};

export function AmpClientProvider({
  children,
  options = DefaultAmpClientOptions,
}: {
  children: React.ReactNode;
  options?: AmpClientOptions;
}) {
  const user = useUser();
  const optionsRef = useRef<AmpClientOptions>(options);

  // This was updated to `useMemo` (originally using a `useEffect`), to ensure the config is set early enough.
  // This avoids a previous issue where the api call to fetch presets was failing since the config didn't have the user's credentials yet.
  const ampClient = useMemo(() => {
    const { current: currentOptions } = optionsRef;
    const amp = getAmpClient(currentOptions);

    if (
      user &&
      (user.profileId !== currentOptions?.profileId ||
        user.sessionId !== currentOptions?.sessionId)
    ) {
      optionsRef.current = {
        ...currentOptions,
        profileId: user.profileId,
        sessionId: user.sessionId,
      };

      amp.setConfig({
        ...currentOptions,
        profileId: user.profileId,
        sessionId: user.sessionId,
      });
    }

    return amp;
  }, [user]);

  return (
    <AmpClientContext.Provider value={useMemo(() => ampClient, [ampClient])}>
      {children}
    </AmpClientContext.Provider>
  );
}

export function useAmpClient() {
  const ampClient = use(AmpClientContext);
  invariant(ampClient, 'useAmpClient must be used within AmpClientProvider');
  return ampClient;
}

function makeAmpClient(options?: AmpClientOptions) {
  return new AmpClient({
    throwOnUnknownStatus: true,
    throwOnErrorStatus: true,
    tokenCookieSerializer: serialize,
    ...options,
  });
}

// NOTE: This should be migrated away from when possible
const ampSingleton = makeAmpClient();
export { ampSingleton as amp };

let amp: AmpClient | undefined;

export function getAmpClient(options?: AmpClientOptions) {
  if (isServer) {
    return makeAmpClient(options);
  }

  if (!amp) {
    amp = makeAmpClient(options);
  } else {
    amp.setConfig(options);
  }

  return amp;
}
