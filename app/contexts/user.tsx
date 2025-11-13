import type { User } from '@iheartradio/web.config';
import { fromPartial } from '@total-typescript/shoehorn';
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { useHydrated } from 'remix-utils/use-hydrated';
import { useSessionStorage } from 'usehooks-ts';

import { amp } from '~app/api/amp-client';
import { getUserFromCookie } from '~app/cookie.client';

export interface UserProviderProps {
  children: ReactNode;
}

const ABSOLUTE_BASE_USER: User = fromPartial({
  isAnonymous: true,
  subscription: {
    type: 'FREE',
  },
});

const UserContext = createContext<User>(ABSOLUTE_BASE_USER);

function UserContextProvider({ children }: UserProviderProps) {
  const [_pid, setPid] = useSessionStorage<number | null>('pid', null, {
    initializeWithValue: false,
  });
  const userFromCookie = getUserFromCookie?.();
  const isClient = typeof window !== 'undefined';
  const isHydrated = useHydrated();

  useEffect(() => {
    if (isClient && userFromCookie) {
      amp.setConfig({
        profileId: userFromCookie.profileId,
        sessionId: userFromCookie.sessionId,
      });

      setPid(userFromCookie.profileId);
    }
  }, [isClient, setPid, userFromCookie]);

  const contextValue = useMemo(
    () => (isHydrated ? userFromCookie : null) ?? ABSOLUTE_BASE_USER,
    [userFromCookie, isHydrated],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

function useUser(): User {
  return useContext(UserContext);
}

export { UserContext, UserContextProvider, useUser };
