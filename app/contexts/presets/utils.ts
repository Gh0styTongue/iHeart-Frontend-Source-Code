import { addToast } from '@iheartradio/web.accomplice/components/toast';
import type { PresetKeys, PresetsTypes } from '@iheartradio/web.api/amp';
import type { CatalogType } from '@iheartradio/web.assets';
import { MediaServerURL } from '@iheartradio/web.assets';
import type { Key, ListData } from 'react-stately';
import { isNonNullish, isPlainObject } from 'remeda';
import type { z } from 'zod';

import type { Preset } from '~app/routes/_app/_index/components/presets-carousel';
import type { ArtistProfileLoaderData } from '~app/routes/_app/artist.$artistSlug/_artist-profile';
import type { AlbumProfileLoaderData } from '~app/routes/_app/artist.$artistSlug_.albums.$albumSlug/.server/loader';
import type { SongProfileLoaderData } from '~app/routes/_app/artist.$artistSlug_.songs.$trackSlug/.server/loader';
import type { FavoritesProfileLoaderData } from '~app/routes/_app/favorites.($userId)/.server/loader';
import type { LiveProfileServerLoaderData } from '~app/routes/_app/live.$liveSlug/.server/loader';
import type { PlaylistProfileServerLoaderData } from '~app/routes/_app/playlist.$playlistSlug/.server/loader';
import type { PodcastProfileServerLoaderData } from '~app/routes/_app/podcast.$podcastSlug/.server/loader';
import type { EpisodeProfileLoaderData } from '~app/routes/_app/podcast.$podcastSlug_.episode.$episodeSlug/_podcast-episode-profile';
import { fallbackImage, PRESETS_EVENTS } from '~app/utilities/constants';

import type { Presets } from './presets-storage';
import { PresetsStorage } from './presets-storage';

export const ContentTypes = {
  ARTIST: 'artist',
  COLLECTION: 'playlist',
  FAVORITES: 'station',
  LIVE: 'station',
  PODCAST: 'podcast',
} as const;

export type PresetIndex = (typeof PresetKeys)['_input'];

type LoaderData =
  | LiveProfileServerLoaderData
  | ArtistProfileLoaderData
  | AlbumProfileLoaderData
  | SongProfileLoaderData
  | PlaylistProfileServerLoaderData
  | PodcastProfileServerLoaderData
  | EpisodeProfileLoaderData
  | FavoritesProfileLoaderData;

export const getAnalyticsLocation = ({
  isInDrawer,
  isOpen,
}: {
  isInDrawer: boolean;
  isOpen: boolean;
}) =>
  isOpen ? PRESETS_EVENTS.NOW_PLAYING
  : isInDrawer ? PRESETS_EVENTS.MINI_PLAYER
  : PRESETS_EVENTS.PRESETS_MENU;

// This is a typeguard function for when presets accesses analytics data out of loaders.
// Analytics data will only be provided from profile page loaders, so we want to make sure TS knows if the data is present or not.
export const hasAnalyticsData = (
  loaderData: unknown,
): loaderData is LoaderData => {
  // Check if the loader contains analytics data
  return isPlainObject(loaderData) && isNonNullish(loaderData.analytics);
};

export const persistToStorage = (data: Presets, callback?: () => void) => {
  // Clear all items from memory storage
  Array.from({ length: 15 }, (_, i) => i).map(i =>
    PresetsStorage.remove(String(i) as PresetIndex),
  );

  // Save fresh new data to storage
  PresetsStorage.serialize(data, callback);
};

export function attemptToAddPreset({
  id,
  title,
  type,
  position,
}: {
  id: Key;
  title: string;
  type: z.infer<typeof PresetsTypes>;
  position?: PresetIndex;
}) {
  const presets = PresetsStorage.deserialize();
  const keys = Object.keys(presets);
  const presetsLength = keys.length;

  // If presets is full -- error
  if (presetsLength === 15) {
    addToast({
      kind: 'error',
      text: `Your presets are full. Remove one to add this ${ContentTypes[type]}`,
    });
    return { success: false };
  }

  const itemAlreadyExists = Object.values(presets).find(preset => {
    return preset.id === id && preset.type === type;
  });

  // If specific item already exists within user's presets data -- error
  if (itemAlreadyExists) {
    addToast({
      kind: 'info',
      text: `${title} has already been added to your presets`,
    });
    return { success: false };
  }

  // If a position is not specified...
  if (!position) {
    // Find first available index - i.e. [0,1,2,4,7]: First available would be "3"
    const availableIndex = Array.from({ length: 15 }, (_, i) => i).find(
      (_, index) => !keys.includes(String(index) as PresetIndex),
    );

    // If a valid index was found, save to storage
    if (availableIndex !== undefined) {
      persistToStorage(
        {
          ...presets,
          [String(availableIndex)]: { id, type, title },
        },
        () => addToast({ kind: 'success', text: `${title} added to presets` }),
      );

      return { success: true, index: availableIndex };
    }
  } else if (position && !keys.includes(position)) {
    // If specific position is provided and that position isn't filled in presets data, save to storage
    persistToStorage(
      {
        ...presets,
        [String(position)]: { id, type, title },
      },
      () => addToast({ kind: 'success', text: `${title} added to presets` }),
    );

    return { success: true };
  } else if (position && keys.includes(position)) {
    // If specific position is provided and that position is already filled in presets data -- error
    addToast({
      kind: 'error',
      text: `There was an issue adding ${title} to your presets. Please try again`,
    });
    return { success: false };
  }

  return { success: false };
}

export function addPreset({
  analyticsCallback,
  id,
  imageUrl,
  position,
  presetListData,
  title,
  type,
}: {
  analyticsCallback?: () => void;
  id: Key;
  imageUrl: Preset['imageUrl'];
  position?: PresetIndex;
  presetListData: ListData<Preset>;
  title: string;
  type: z.infer<typeof PresetsTypes>;
}) {
  const { success, index } = attemptToAddPreset({ id, title, type, position });
  const newPosition = position ? Number.parseInt(position) : index!;

  // If successfully added + saved...
  if (success) {
    // Remove the placeholder tile from the UI so a refresh is not needed.
    presetListData.remove(newPosition);
    // Insert a card populated with the content into the slot that was previously a placeholder tile. This prevents carousel layout shift.
    presetListData.insert(newPosition, {
      id,
      index: String(newPosition) as PresetIndex,
      type,
      title,
      imageUrl,
    });

    analyticsCallback?.();
  }
}

export function attemptToDeletePreset({
  title,
  position,
}: {
  title: string;
  position: PresetIndex;
}) {
  const presets = PresetsStorage.deserialize();
  const keys = Object.keys(presets);
  // If the position provided is occupied in the preset data...
  if (keys.includes(String(position))) {
    // Delete item from that position and save to storage
    delete presets[position];
    persistToStorage(presets, () =>
      addToast({ kind: 'success', text: `${title} removed from presets` }),
    );

    return { success: true };
  } else {
    addToast({
      kind: 'error',
      text: `There was an issue removing ${title} from your presets. Please try again.`,
    });

    return { success: false };
  }
}

export function deletePreset({
  analyticsCallback,
  id,
  position,
  presetListData,
  title,
}: {
  analyticsCallback?: () => void;
  id: Key;
  position: PresetIndex;
  presetListData: ListData<Preset>;
  title: string;
}) {
  const { success } = attemptToDeletePreset({ title, position });

  // If successfully deleted + saved...
  if (success) {
    // Remove the content card from the UI so a refresh is not needed.
    presetListData.remove(id);
    // Insert an empty placeholder tile into the slot that was previously a content card. This prevents carousel layout shift.
    presetListData.insert(Number.parseInt(position), {
      id: Number(position),
      index: position,
    });

    analyticsCallback?.();
  }
}

export function movePreset({
  presetData,
  movedId,
  newPosition,
  oldPosition,
}: {
  presetData: ListData<Preset>;
  movedId: Key;
  newPosition: Key | number;
  oldPosition: Key;
}) {
  /**
   * This logic is a relatively hacky way to prevent a state disconnect during drag and drop.
   * The potential disconnect that can happen - Ex: A card is moved from slot 8 to slot 2. In the UI it appears in slot 2, but its stored `index` is 8.
   *
   * This logic ensures that once an item is moved with drag and drop functionality, all items are re-indexed to reflect the UI order.
   * This is necessary as `listData` doesn't update after each item is moved within the scope of this function, so we need to manually do the reordering.
   */

  // The object will store all presets (i.e. no placeholder data) to save to local storage and AMP
  const presetsObj = {} as Record<PresetIndex, Preset>;

  // Create a copy of `presetData` and filter out the preset being moved in the array
  const temporaryPresets = [...presetData.items].filter(
    preset => preset.id !== movedId,
  );

  // Saved the moved preset in a const for reference
  const presetThatMoved = presetData.items[Number(oldPosition)];

  // Insert the moved preset at the new index in the array
  temporaryPresets.splice(newPosition as number, 0, presetThatMoved);

  // Loop through the reordered preset array
  for (const [index, preset] of temporaryPresets.entries()) {
    const arrayIndex = String(index) as PresetIndex;

    // [Note]: `presetsObj` is for saved presets only, we save them in localStorage for later reference.
    // If an `imageUrl` is present, we know it is NOT a placeholder, so we save add it to `presetsObj`
    if (preset?.imageUrl) {
      // Add that preset to the presetsObj
      presetsObj[arrayIndex] = {
        ...preset,
        index: arrayIndex,
      };
    }

    // Update the preset's stored `index` with the index/position from the array
    // This is crucial because at this point the stored `index` for each preset is out of sync with its place in the array.
    if (preset?.id) {
      presetData.update(preset.id, {
        ...preset,
        index: arrayIndex,
      });
    }
  }
  // Store any populated presets (not placeholders) in local storage
  persistToStorage(presetsObj as Presets);
}

export const getPresetsImage = ({
  id,
  type,
  imageUrl,
}: {
  id: string | number;
  type: Preset['type'];
  imageUrl: Preset['imageUrl'];
}) => {
  return (
    type ?
      type !== 'COLLECTION' ?
        MediaServerURL.fromCatalog({
          id: String(id),
          type: type.toLowerCase() as CatalogType,
        })
          .ratio(1, 1)
          .resize(150)
          .toString()
      : imageUrl ?
        MediaServerURL.fromURL(imageUrl).ratio(1, 1).resize(150).toString()
      : `${fallbackImage}?ops=gravity("center"),ratio(1,1)`
    : undefined
  );
};
