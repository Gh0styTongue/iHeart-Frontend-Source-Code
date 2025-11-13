import { invariant } from '@epic-web/invariant';
import { addToast } from '@iheartradio/web.accomplice/components/toast';
import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ListData } from 'react-stately';
import { useListData } from 'react-stately';
import { prop } from 'remeda';

import { useAmpClient } from '~app/api/amp-client';
import type { Preset } from '~app/routes/_app/_index/components/presets-carousel';

import type { Presets } from './presets-storage';
import { PresetsStorage } from './presets-storage';
import type { PresetIndex } from './utils';
import { persistToStorage } from './utils';

export type PresetsAnalytics = {
  preset_added: {
    view: {
      station: {
        id: string;
        name: string;
      };
    };
  };
  preset_removed: {
    view: {
      station: {
        id: string;
        name: string;
      };
    };
  };
};

// Create an array that has 15 objects where the objects will be:
// 1. An empty placeholder
// 2. The preset object
// This ensures the <PresetsCarousel /> will always have 15 cards
export const mapPresets = (presetData?: Presets) => {
  return Array.from({ length: 15 }, (_, i) => {
    const index = String(i) as PresetIndex;

    if (presetData?.[index]) {
      return { ...presetData[index]!, index };
    }
    return { id: Number(index), index };
  });
};

const PresetsContext = createContext<{
  presetListData: ListData<Preset>;
  hasFetchedPresets: boolean;
  presetsLength: number;
}>({
  presetListData: [] as unknown as ListData<Preset>,
  hasFetchedPresets: false,
  presetsLength: 0,
});

export function usePresetsContext() {
  const contextValue = useContext(PresetsContext);
  invariant(
    contextValue,
    `'usePresetsContext()' must be used within PresetsProvider`,
  );
  return contextValue;
}

export const PresetsProvider = ({ children }: { children: ReactNode }) => {
  // Initialize the context with a `listData` object with an array of empty placeholder objects
  const presetListData = useListData({ initialItems: mapPresets() });
  const putRef = useRef<boolean>(false);

  const amp = useAmpClient();
  const [hasFetchedPresets, setHasFetchedPresets] = useState(false);

  const fetchPresets = useCallback(async () => {
    return await amp.api.v3.profiles
      .getPresets()
      .then(prop('body'))
      .then(prop('presets'))
      .then(data => {
        if (data) {
          const presetData = mapPresets(data);
          persistToStorage(data);

          // Once the presets are fetched, update the `listData` with the stations
          for (const [index, item] of presetListData.items.entries()) {
            // `presetData` is the data from amp.
            // `presetListData` is the empty placeholder object.
            // So, we loop through the `presetListData` and check for a mismatch between the ids.
            // A mismatch would mean that the `listData` has a placeholder in that slot and should be updated with the preset station at that index.
            if (item.id !== presetData[index].id) {
              presetListData.update(item.id, presetData[index]);
            }
          }
        }

        setHasFetchedPresets(true);

        return data;
      })
      .catch(() => {
        console.warn('Failed to fetch presets');
        return null;
      });
  }, [amp.api.v3.profiles, presetListData]);

  const putPresets = useCallback(
    async ({ presets }: { presets: Presets }) => {
      return await amp.api.v3.profiles
        .putPresets({ body: { presets } })
        .then(data => data.body)
        .catch(() => {
          console.warn('Failed to put presets');
          return null;
        });
    },
    [amp.api.v3.profiles],
  );

  useEffect(() => {
    // On initial mount, fetch presets data and save to state
    if (!putRef.current && amp.hasCredentials) {
      fetchPresets();
    }
  }, [fetchPresets, amp.hasCredentials]);

  useEffect(() => {
    // Subscribe to PresetsStorage's `serialize` method,
    // When `serialize` is called, PUT that new data to amp and then GET the presets data
    return PresetsStorage.subscribe({
      serialize: async (_, data, callback) => {
        const presets = Object.entries(data).reduce((acc, [key, value]) => {
          if (value) {
            const { id, type } = value;
            return { ...acc, [key]: { id, type } };
          } else {
            return acc;
          }
        }, {} as Presets);

        try {
          if (putRef.current) {
            await putPresets({ presets });
          }
          putRef.current = true;
          callback?.();
        } catch {
          addToast({
            kind: 'warning',
            title: 'Oops!',
            text: 'Your presets are saved to the browser, but we failed to synchronize them to the server. This data may be lost in future sessions.',
          });
        }
      },
    });
  }, [amp, fetchPresets, putPresets, presetListData]);

  const contextValue = useMemo(
    () => ({
      presetListData,
      hasFetchedPresets,
      presetsLength: presetListData.items.filter(preset => 'imageUrl' in preset)
        .length,
    }),
    [presetListData, hasFetchedPresets],
  );

  return (
    <PresetsContext.Provider value={contextValue}>
      {children}
    </PresetsContext.Provider>
  );
};
