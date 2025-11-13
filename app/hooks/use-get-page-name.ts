import { useMatches } from 'react-router';
import { isPlainObject } from 'remeda';

/** Get the `pageName` of the closest route match */
export const useGetPageName = () => {
  const matches = useMatches();

  for (const match of matches.toReversed()) {
    if (isPlainObject(match.data) && typeof match.data.pageName === 'string') {
      return match.data.pageName;
    }
  }

  return '';
};
