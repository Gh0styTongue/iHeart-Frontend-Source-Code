import type { Key, ReactNode } from 'react';
import { createContext, use, useCallback, useMemo } from 'react';
import { isNonNullish } from 'remeda';

import { trackClick } from '~app/analytics/track-click';
import { useConfig } from '~app/contexts/config';
import { useMarket } from '~app/contexts/market';
import { useGetPageName } from '~app/hooks/use-get-page-name';
import type { MarketGenre } from '~app/queries/radio-dial';
import { logger } from '~app/utilities/logger';

import { useRadioDialFilterData } from './state/use-filter-data';
import { useFilterItems } from './state/use-filter-items';
import { useRadioDialFilterState } from './state/use-filter-state';

function safeCompileRegex(strRegex: string) {
  try {
    // eslint-disable-next-line security/detect-non-literal-regexp
    return new RegExp(strRegex);
  } catch (error: unknown) {
    logger.warn(
      error instanceof Error ? error.message : 'Could not compile regex',
    );
    return undefined;
  }
}

type RadioDialFiltersCallbacksContextValue = {
  findGenre: (genreId: number) => MarketGenre | undefined;
  onChange: (data: Key | null) => void;
  onInputChange: (value: string) => void;
};

const RadioDialFiltersCallbacksContext =
  createContext<RadioDialFiltersCallbacksContextValue>({
    findGenre: (_id: number) => undefined,
    onChange: (_data: Key | null) => void 0,
    onInputChange: (_value: string) => void 0,
  });

export function RadioDialFiltersCallbacksProvider({
  children,
}: {
  children: ReactNode;
}) {
  const config = useConfig();
  const { setMarket } = useMarket();
  const [filterState, updateFilterState] = useRadioDialFilterState();
  const [filterData] = useRadioDialFilterData();
  const pageName = useGetPageName();
  const { locationMap } = useFilterItems();

  const findGenre = useCallback(
    (genreId: number) => {
      return filterData.genres?.find(genre => genre.id === genreId);
    },
    [filterData.genres],
  );

  const zipRegex = useMemo(
    () =>
      isNonNullish(config.environment.registrationOptions?.zipRegex) ?
        safeCompileRegex(config.environment.registrationOptions.zipRegex)
      : undefined,
    [config.environment.registrationOptions?.zipRegex],
  );

  const onChange = useCallback(
    (data: Key | null) => {
      if (data?.toString().startsWith('country-')) {
        updateFilterState({
          type: 'updateIsChangingLocation',
          payload: {
            isChangingLocation: true,
          },
        });
      } else if (data?.toString().startsWith('market-')) {
        const marketId = Number(data.toString().replace('market-', ''));
        updateFilterState({
          type: 'updateActiveMarket',
          payload: {
            marketId,
          },
        });
        const updatedMarket = locationMap.get(marketId);
        if (updatedMarket) {
          trackClick({
            pageName,
            sectionName: 'radio_dial',
            location: 'filter',
            filterType: 'city',
            filterSelection: `${updatedMarket.city}, ${updatedMarket.stateAbbreviation}`,
          });

          setMarket(updatedMarket);
        }
      } else if (data?.toString().startsWith('genre-')) {
        const genreId = Number(data.toString().replace('genre-', ''));
        updateFilterState({
          type: 'updateSelectedGenreId',
          payload: {
            genreId,
          },
        });

        const updatedGenreName = findGenre(genreId)?.name ?? 'All Genres';

        trackClick({
          pageName,
          sectionName: 'radio_dial',
          location: 'filter',
          filterType: 'genre',
          filterSelection: updatedGenreName,
        });
      } else if (
        data?.toString() === 'use-current-location' &&
        isNonNullish(filterData.geoMarket?.countryAbbreviation)
      ) {
        updateFilterState({
          type: 'batchUpdate',
          payload: {
            updateActiveMarket: { marketId: filterState.geoMarketId },
            ...((
              filterState.selectedCountryCode !==
              filterData.geoMarket?.countryAbbreviation
            ) ?
              {
                updateSelectedCountryCode: {
                  countryCode: filterData.geoMarket?.countryAbbreviation,
                },
              }
            : {}),
          },
        });
        const updatedMarket = locationMap.get(filterState.geoMarketId);
        if (updatedMarket) {
          trackClick({
            pageName,
            sectionName: 'radio_dial',
            location: 'filter',
            filterType: 'current_location',
            filterSelection: `${updatedMarket.city}, ${updatedMarket.stateAbbreviation}`,
          });

          setMarket(updatedMarket);
        }
      }
    },
    [
      filterData.geoMarket?.countryAbbreviation,
      updateFilterState,
      locationMap,
      pageName,
      setMarket,
      findGenre,
      filterState.geoMarketId,
      filterState.selectedCountryCode,
    ],
  );

  const onInputChange = useCallback(
    (value: string) => {
      if (zipRegex && zipRegex.test(value)) {
        updateFilterState({
          type: 'queryMarketsByZip',
          payload: {
            zipCode: value,
          },
        });
      }
    },
    [updateFilterState, zipRegex],
  );

  const callbacks = useMemo(
    () => ({
      findGenre,
      onChange,
      onInputChange,
    }),
    [findGenre, onChange, onInputChange],
  );

  return (
    <RadioDialFiltersCallbacksContext.Provider value={callbacks}>
      {children}
    </RadioDialFiltersCallbacksContext.Provider>
  );
}

export const useRadioDialFiltersCallbacks = () =>
  use(RadioDialFiltersCallbacksContext);
