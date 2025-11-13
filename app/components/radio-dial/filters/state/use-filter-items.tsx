import { invariant } from '@epic-web/invariant';
import type { DefaultSelectOption } from '@iheartradio/web.accomplice/components/select-field';
import type { ReactNode } from 'react';
import { createContext, use, useMemo } from 'react';
import { isNonNullish } from 'remeda';

import type { Market } from '~app/queries/radio-dial';

import type { RadioDialComboboxItem } from '../filters';
import { useRadioDialFilterData } from './use-filter-data';
import { useRadioDialFilterState } from './use-filter-state';

type RadioDialFilterItemsContextValue = {
  locationItems: RadioDialComboboxItem[];
  locationMap: Map<number, Market>;
  genreItems: Iterable<DefaultSelectOption>;
};

const RadioDialFilterItemsContext =
  createContext<RadioDialFilterItemsContextValue>({
    locationItems: [],
    locationMap: new Map(),
    genreItems: [],
  });

export function RadioDialFilterItemsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [filterState] = useRadioDialFilterState();
  const [filterData] = useRadioDialFilterData();

  const locationItems = useMemo<RadioDialComboboxItem[]>(() => {
    const items: RadioDialComboboxItem[] = [];

    const currentCountry = filterData.countries?.find(
      country => country.abbreviation === filterState.selectedCountryCode,
    );
    const geoMarket = filterData.geoMarket;

    if (currentCountry) {
      items.push({
        id: 'location',
        children: [
          {
            id: 'use-current-location',
            name:
              geoMarket ?
                `${geoMarket.city}, ${geoMarket.stateAbbreviation}`
              : '',
            itemId: geoMarket?.marketId,
            markSelected: geoMarket?.marketId == filterState.activeMarketId,
          },
          {
            id: `country-${currentCountry.abbreviation}`,
            name: currentCountry.name,
          },
        ],
      });
    }

    if (isNonNullish(filterData.markets)) {
      items.push({
        id: 'markets',
        children: filterData.markets.map(market => ({
          id: `market-${market.marketId}`,
          name: market.displayName,
          itemId: market.marketId,
        })),
      });
    }

    return items;
  }, [
    filterData.countries,
    filterData.markets,
    filterState.selectedCountryCode,
    filterState.activeMarketId,
    filterData.geoMarket,
  ]);

  const locationMap = useMemo(
    () =>
      new Map<number, Market>(
        (filterData.markets ?? []).map(market => [market.marketId, market]),
      ),
    [filterData?.markets],
  );

  const genreItems = useMemo<Iterable<DefaultSelectOption>>(
    () =>
      filterData.genres?.reduce((accumulator, genre) => {
        accumulator.push({
          key: `genre-${genre.id}`,
          label: genre.name,
          value: genre.id.toString(),
        });

        return accumulator;
      }, [] as DefaultSelectOption[]) ?? [],
    [filterData.genres],
  );

  return (
    <RadioDialFilterItemsContext.Provider
      value={useMemo(
        () => ({ locationItems, locationMap, genreItems }),
        [genreItems, locationItems, locationMap],
      )}
    >
      {children}
    </RadioDialFilterItemsContext.Provider>
  );
}

export const useFilterItems = () => {
  const ctx = use(RadioDialFilterItemsContext);
  invariant(ctx, 'RadioDialFilterItemsContext is null');
  return ctx;
};
