import { useMemo } from 'react';
import { isNonNullish, isNullish } from 'remeda';

import { useUser } from '~app/contexts/user';

export const useDisplayAd = (breakpoint: boolean | undefined) => {
  const user = useUser();

  const display = useMemo(() => {
    return (
      !(
        !isNullish(user) &&
        (user.subscription?.type === 'PREMIUM' ||
          user.subscription?.type === 'PLUS')
      ) &&
      isNonNullish(breakpoint) &&
      breakpoint
    );
  }, [user, breakpoint]);

  return {
    display,
  };
};
