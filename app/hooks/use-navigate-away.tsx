import { useEffect } from 'react';
import { useLocation, useNavigation } from 'react-router';
import { isFunction, isNonNullish } from 'remeda';

function compareRoutes(
  currentRoute: string,
  comparisonRoute: string,
  partialMatch: boolean,
) {
  return partialMatch ?
      currentRoute.endsWith(comparisonRoute)
    : currentRoute === comparisonRoute;
}

export const useNavigateAway = (
  route: string,
  cb: () => void,
  predicate?: boolean | (() => boolean),
  options?: { partialRouteMatch: boolean },
) => {
  const { partialRouteMatch = false } = options ?? {};
  const location = useLocation();
  const navigation = useNavigation();

  useEffect(() => {
    const predicateResult =
      isNonNullish(predicate) ?
        isFunction(predicate) ? predicate()
        : predicate
      : true;
    if (
      compareRoutes(location.pathname, route, partialRouteMatch) &&
      navigation.state === 'loading' &&
      navigation.location &&
      navigation.location.pathname !== location.pathname &&
      predicateResult
    ) {
      cb();
    }
  }, [
    cb,
    location.pathname,
    navigation.location,
    navigation.state,
    route,
    predicate,
    partialRouteMatch,
  ]);
};
