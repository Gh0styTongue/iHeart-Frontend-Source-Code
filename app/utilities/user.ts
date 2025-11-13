import {
  type User,
  countryCodesEnum,
  SubscriptionTypeEnum,
} from '@iheartradio/web.config';
import { useMemo } from 'react';
import { isNonNullish } from 'remeda';

const internationalCodes = new Set([
  countryCodesEnum.Values.AU.toString(),
  countryCodesEnum.Values.CA.toString(),
  countryCodesEnum.Values.NZ.toString(),
  countryCodesEnum.Values.MX.toString(),
]);

export function isPremiumUser(user?: User | null): boolean {
  return (
    isNonNullish(user) &&
    user?.subscription?.type === SubscriptionTypeEnum.PREMIUM
  );
}

export function isAnonymousUser(user?: User | null): boolean {
  return isNonNullish(user) && user?.isAnonymous;
}

export function isInternationalUser(user?: User | null) {
  return user && internationalCodes.has(user.country);
}

export function useIsInternationalUser(user?: User | null) {
  return useMemo(
    () => user?.country && internationalCodes.has(user.country),
    [user?.country],
  );
}
