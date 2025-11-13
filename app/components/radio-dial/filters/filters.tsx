import { Button } from '@iheartradio/web.accomplice/components/button';
import type {
  ComboboxItemType,
  ComboboxProps,
} from '@iheartradio/web.accomplice/components/combobox';
import {
  Combobox,
  ComboboxItem,
} from '@iheartradio/web.accomplice/components/combobox';
import {
  Dialog,
  DialogContainer,
  DialogTitle,
} from '@iheartradio/web.accomplice/components/dialog';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import type { SelectFieldProps } from '@iheartradio/web.accomplice/components/select-field';
import {
  SelectField,
  SelectOption,
} from '@iheartradio/web.accomplice/components/select-field';
import { Stack } from '@iheartradio/web.accomplice/components/stack';
import { Text } from '@iheartradio/web.accomplice/components/text';
import { Location } from '@iheartradio/web.accomplice/icons/location';
import { useMemo } from 'react';
import { isNonNullish } from 'remeda';

import { trackClick } from '~app/analytics/track-click';
import { useIsMobile } from '~app/contexts/is-mobile';
import { useGetPageName } from '~app/hooks/use-get-page-name';
import { getMarketSlug } from '~app/routes/_app/live.country.$country.(city).($marketSlug)/utils';

import {
  RadioDialFiltersCallbacksProvider,
  useRadioDialFiltersCallbacks,
} from './callbacks';
import { ListBoxEmptyState } from './components/list-box-empty-state';
import { RadioDialComboboxSection } from './components/radio-dial-combobox-section';
import { RadioDialFiltersEffects } from './effects';
import {
  RadioDialFilterDataProvider,
  useRadioDialFilterData,
} from './state/use-filter-data';
import {
  RadioDialFilterItemsProvider,
  useFilterItems,
} from './state/use-filter-items';
import {
  RadioDialFilterStateProvider,
  useRadioDialFilterState,
} from './state/use-filter-state';

export interface RadioDialComboboxItem
  extends Exclude<ComboboxItemType, 'children'> {
  markSelected?: boolean;
  itemId?: string | number;
  children?: RadioDialComboboxItem[];
}

export function RadioDialFilters() {
  return (
    <RadioDialFilterStateProvider>
      <RadioDialFilterDataProvider>
        <RadioDialFilterItemsProvider>
          <RadioDialFiltersCallbacksProvider>
            <RadioDialFilters_ />
          </RadioDialFiltersCallbacksProvider>
        </RadioDialFilterItemsProvider>
      </RadioDialFilterDataProvider>
    </RadioDialFilterStateProvider>
  );
}

function RadioDialFilters_() {
  const [filterState, updateFilterState] = useRadioDialFilterState();

  return (
    <>
      <RadioDialFiltersEffects />
      <LiveStationFilterCombos
        renderEmptyState={({ state }) => {
          return (
            <ListBoxEmptyState
              // @ts-expect-error inputValue *does* exist, I just can't find it in the types
              inputValue={state.inputValue}
            />
          );
        }}
        title="Live Radio Dial"
      />
      <DialogContainer
        onDismiss={() => {
          updateFilterState({
            type: 'updateIsChangingLocation',
            payload: { isChangingLocation: false },
          });
        }}
      >
        {filterState.isChangingLocation ?
          <SelectCountryDialog />
        : null}
      </DialogContainer>
    </>
  );
}

export function SelectCountryDialog() {
  const pageName = useGetPageName();

  const [filterData] = useRadioDialFilterData();
  const [, updateFilterState] = useRadioDialFilterState();

  return (
    <Dialog data-test="select-country-dialog">
      <Stack gap="$16">
        <DialogTitle>Select Country</DialogTitle>
        <Stack gap="$8">
          {filterData.countries?.map(country => (
            <Button
              color="red"
              data-test={`country-${country.id}`}
              key={country.id}
              kind="secondary"
              onPress={() => {
                trackClick({
                  pageName,
                  sectionName: 'radio_dial',
                  location: 'filter',
                  filterType: 'country',
                  filterSelection: country.abbreviation,
                });

                updateFilterState({
                  type: 'batchUpdate',
                  payload: {
                    updateSelectedCountryCode: {
                      countryCode: country.abbreviation,
                    },
                    updateActiveMarket: {
                      marketId: 0,
                    },
                    updateIsChangingLocation: {
                      isChangingLocation: false,
                    },
                  },
                });
              }}
              size="small"
            >
              {country.name}
            </Button>
          ))}
        </Stack>
        <Button
          color="red"
          kind="primary"
          onPress={() => {
            updateFilterState({
              type: 'updateIsChangingLocation',
              payload: {
                isChangingLocation: false,
              },
            });
          }}
          size="small"
        >
          Close
        </Button>
      </Stack>
    </Dialog>
  );
}

export function LiveStationFilterCombos({
  onGenreChange,
  onLocationChange,
  renderEmptyState,
  title,
}: {
  onGenreChange?: SelectFieldProps['onSelectionChange'];
  onLocationChange?: ComboboxProps['onSelectionChange'];
  renderEmptyState?: ComboboxProps['renderEmptyState'];
  title: string;
}) {
  const isMobile = useIsMobile();

  const { locationItems, locationMap, genreItems } = useFilterItems();
  const [filterState] = useRadioDialFilterState();
  const { onChange, onInputChange } = useRadioDialFiltersCallbacks();

  const locationInputSize = useMemo(() => {
    const location = locationMap.get(filterState.activeMarketId);
    if (location) {
      return getMarketSlug(location).trim().length;
    }
  }, [filterState.activeMarketId, locationMap]);

  return (
    <Flex
      alignItems="center"
      data-test="live-radio-dial-filters"
      direction="row"
      gap={{ xsmall: '$8', large: '$16' }}
      justifyContent={{ xsmall: 'space-between', large: 'flex-start' }}
      width="100%"
    >
      <Text
        as="h3"
        css={{ fontWeight: 700, whiteSpace: 'nowrap' }}
        kind={{ mobile: 'h4', large: 'h3' }}
      >
        {title}
      </Text>
      <Flex
        direction="row"
        gap={{ xsmall: '$8', large: '$16' }}
        marginRight={{ pointerCoarse: 0, pointerFine: '$16' }}
      >
        <Combobox
          allowsCustomValue
          autoSelectText={!isMobile}
          data-test="live-radio-dial-location"
          defaultItems={locationItems}
          hideLabel
          inputIcon={{
            icon: <Location />,
            props: {
              size: 16,
              css: {
                marginLeft: '.8rem',
              },
            },
          }}
          inputSize={locationInputSize}
          label="live radio dial location"
          onInputChange={onInputChange}
          onSelectionChange={onLocationChange ?? onChange}
          placeholder="Loading Cities..."
          popoverProps={{ maxHeight: 400 }}
          renderEmptyState={renderEmptyState}
          selectedKey={`market-${filterState.activeMarketId}`}
        >
          {item =>
            isNonNullish(item.children) ?
              <RadioDialComboboxSection section={item} />
            : <ComboboxItem
                data-test={item.id}
                key={item.id}
                textValue={item.name}
              >
                <Text kind="caption-2">{item.name}</Text>
              </ComboboxItem>
          }
        </Combobox>
        <SelectField
          aria-label="Radio Dial Genre Filter"
          css={{
            flexShrink: 1,
            width: {
              xsmall: '9.8rem',
              small: '12rem',
              medium: 'auto',
            },
            maxWidth: {
              medium: '20rem',
            },
          }}
          data-test="live-radio-dial-genre"
          defaultSelectedKey={`genre-${filterState.selectedGenreId}`}
          items={genreItems}
          key={`live-radio-dial-genre-${filterState.selectedGenreId}`}
          onSelectionChange={onGenreChange ?? onChange}
          placeholder="Loading Genres..."
        >
          {item => (
            <SelectOption key={item.key} textValue={item.label}>
              {item.label}
            </SelectOption>
          )}
        </SelectField>
      </Flex>
    </Flex>
  );
}
