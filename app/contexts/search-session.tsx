import { invariant } from '@epic-web/invariant';
import { createMemoryStorage } from '@iheartradio/web.utilities/create-storage';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { v4 as uuid } from 'uuid';

export type SearchSession = {
  open: boolean;
  start: boolean;
  sessionId: string;
};

const SearchSessionStorage = createMemoryStorage<SearchSession>({
  open: false,
  start: false,
  sessionId: uuid(),
});

const SearchSessionContext =
  createContext<typeof SearchSessionStorage>(SearchSessionStorage);

export function SearchSessionProvider({ children }: { children: ReactNode }) {
  return (
    <SearchSessionContext.Provider value={SearchSessionStorage}>
      {children}
    </SearchSessionContext.Provider>
  );
}

export function useSearchSessionContext(): typeof SearchSessionStorage {
  const searchSessionContext = useContext(SearchSessionContext);

  invariant(
    searchSessionContext,
    'Cannot use searchSessionContext outside SearchSession Provider',
  );

  return searchSessionContext;
}
