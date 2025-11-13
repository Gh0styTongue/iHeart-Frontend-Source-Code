import { useContext, useEffect } from 'react';
import { isNonNullish } from 'remeda';

import { useMarket } from '~app/contexts/market';
import { useQueryMarketByZipCode } from '~app/queries/radio-dial';

import { ScanContext } from '../scan-context';
import { useRadioDialData } from '../state/radio-dial-data';
import { useRadioDialFiltersCallbacks } from './callbacks';
import { useRadioDialFilterData } from './state/use-filter-data';
import { useFilterItems } from './state/use-filter-items';
import { useRadioDialFilterState } from './state/use-filter-state';

export function RadioDialFiltersEffects() {
  const { geoMarket } = useMarket();

  const [, radioDialDataDispatch] = useRadioDialData();
  const [filterState, updateFilterState] = useRadioDialFilterState();
  const [filterData] = useRadioDialFilterData();
  const { findGenre } = useRadioDialFiltersCallbacks();
  const { locationMap } = useFilterItems();

  const marketByZipCodeQuery = useQueryMarketByZipCode({
    zipCode: filterState.queryByZip,
  });

  const { stopScan } = useContext(ScanContext);

  useEffect(() => {
    if (
      isNonNullish(geoMarket) &&
      filterState.geoMarketId !== geoMarket?.marketId
    ) {
      updateFilterState({
        type: 'updateGeoMarket',
        payload: {
          marketId: geoMarket.marketId,
        },
      });
      // If we are set to the default market, and we get an updated geo market
      // then set the active market id to the geo market id
      if (filterState.isDefaultMarket) {
        updateFilterState({
          type: 'batchUpdate',
          payload: {
            updateActiveMarket: {
              marketId: geoMarket.marketId,
            },
            updateIsDefault: {
              isDefault: false,
            },
          },
        });
      }
    }
  }, [
    filterState.geoMarketId,
    filterState.isDefaultMarket,
    geoMarket,
    updateFilterState,
  ]);

  useEffect(() => {
    radioDialDataDispatch({
      type: 'batch',
      payload: {
        updateCountry: {
          country: filterState.selectedCountryCode,
        },
        updateMarket: {
          market: locationMap.get(filterState.activeMarketId),
        },
        updateGenre: {
          genre: findGenre(filterState.selectedGenreId)?.name ?? 'All Genres',
        },
        updateGenreId: {
          genreId: filterState.selectedGenreId,
        },
      },
    });
  }, [
    filterState.selectedCountryCode,
    filterState.activeMarketId,
    filterState.selectedGenreId,
    locationMap,
    radioDialDataDispatch,
    findGenre,
  ]);

  useEffect(() => {
    if (filterState.queryByZip && marketByZipCodeQuery.status === 'success') {
      const matchedMarket = filterData.markets?.find(
        market => market.marketId === marketByZipCodeQuery.data?.marketId,
      );

      if (matchedMarket) {
        updateFilterState({
          type: 'batchUpdate',
          payload: {
            updateActiveMarket: { marketId: matchedMarket.marketId },
            queryMarketsByZip: { zipCode: undefined },
            invalidZip: { isInvalid: false },
          },
        });
      } else {
        updateFilterState({
          type: 'batchUpdate',
          payload: {
            invalidZip: { isInvalid: true },
            queryMarketsByZip: { zipCode: undefined },
          },
        });
      }
    }
  }, [
    filterData.markets,
    filterState.queryByZip,
    marketByZipCodeQuery.data?.marketId,
    marketByZipCodeQuery.status,
    updateFilterState,
  ]);

  useEffect(() => {
    if (isNonNullish(filterData.stations)) {
      radioDialDataDispatch({
        type: 'updateStations',
        payload: {
          stations: filterData.stations,
        },
      });
      stopScan();
    }
  }, [filterData.stations, radioDialDataDispatch, stopScan]);

  useEffect(() => {
    if (isNonNullish(filterData.markets)) {
      radioDialDataDispatch({
        type: 'updateLocation',
        payload: {
          location:
            filterData.markets.find(
              market => market.marketId === filterState.activeMarketId,
            )?.displayName ?? '',
        },
      });
    }
  }, [filterData.markets, filterState.activeMarketId, radioDialDataDispatch]);

  useEffect(() => {
    if (isNonNullish(filterData.genres)) {
      radioDialDataDispatch({
        type: 'batch',
        payload: {
          updateGenre: {
            genre:
              filterData.genres.find(
                genre => genre.id === filterState.selectedGenreId,
              )?.name ?? 'All Genres',
          },
          updateGenreId: {
            genreId: filterState.selectedGenreId,
          },
        },
      });
    }
  }, [filterData.genres, filterState.selectedGenreId, radioDialDataDispatch]);

  return null;
}
