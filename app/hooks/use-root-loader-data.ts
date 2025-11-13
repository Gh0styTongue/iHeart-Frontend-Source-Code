import { invariant } from '@epic-web/invariant';
import { useRouteLoaderData } from 'react-router';

import type { RootLoader } from '~app/root';

export function useRootLoaderData() {
  const loaderData = useRouteLoaderData<RootLoader>('root');
  invariant(loaderData, 'Could not get root loader data');
  return loaderData;
}
