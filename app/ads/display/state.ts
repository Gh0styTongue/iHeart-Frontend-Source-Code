import type {
  JSX,
  MouseEvent as ReactMouseEvent,
  MouseEventHandler,
} from 'react';

import { GoogleAds } from '~app/ads/display/ads';

export type DisplaySlot = {
  adUnitPath: string;
  targeting: { [k: string]: unknown };
  ccrpos: string;
  size: [number, number];
  slotId: string;
};

export type DisplayState = {
  display: 'ad' | 'companion' | 'none';
  slot: DisplaySlot | undefined;
  companionAd: JSX.Element | null;
  previousSlotId?: string;
  shouldDisplay: boolean;
};

export type DisplayStateAction =
  | {
      type: 'display_ad';
      payload: null;
    }
  | {
      type: 'display_companion';
      payload: null;
    }
  | {
      type: 'display_none';
      payload: null;
    }
  | {
      type: 'set_companion';
      payload: JSX.Element | null;
    }
  | {
      type: 'set_slot';
      payload: DisplaySlot;
    };

export function displayStateReducer(
  state: DisplayState,
  action: DisplayStateAction,
): DisplayState {
  const { type, payload } = action;
  switch (type) {
    case 'display_ad': {
      return state.display === 'ad' ?
          state
        : {
            ...state,
            display: 'ad',
          };
    }
    case 'display_companion': {
      return state.display === 'companion' ?
          state
        : {
            ...state,
            display: 'companion',
          };
    }
    case 'display_none': {
      return state.display === 'none' ?
          state
        : {
            ...state,
            display: 'none',
          };
    }
    case 'set_companion': {
      const { shouldDisplay } = state;

      return {
        ...state,
        display:
          payload === null ?
            shouldDisplay ? 'ad'
            : 'none'
          : 'companion',
        companionAd: payload,
      };
    }
    case 'set_slot': {
      const { slot } = state;
      return {
        ...state,
        slot: payload,
        previousSlotId: slot?.slotId,
      };
    }
  }
}

export function displayStateInitializer({
  display,
  displayAdsEnabled,
}: {
  display: boolean;
  displayAdsEnabled: boolean;
}): DisplayState {
  return {
    display: display && displayAdsEnabled ? 'ad' : 'none',
    companionAd: null,
    slot: undefined,
    shouldDisplay: display && displayAdsEnabled,
  };
}

export const addSlot = async ({
  adUnitPath,
  targeting,
  ccrpos,
  size,
  slotId,
  prevSlotId,
}: {
  adUnitPath: string;
  targeting: { [k: string]: unknown };
  ccrpos: string;
  size: [number, number];
  slotId: string;
  prevSlotId?: string;
}) => {
  if (prevSlotId) {
    await GoogleAds.removeSlot(prevSlotId);
  }
  await GoogleAds.receiveTargeting(targeting);
  await GoogleAds.addSlot(adUnitPath, size, slotId, {
    ccrpos,
  });
};

export const removeSlot = async (slotId: string) => {
  await GoogleAds.removeSlot(slotId);
};

/**
 * Generates a random slot ID composed of alphanumeric characters.
 *
 * @param {number} [length=4] - The desired length of the generated slot ID. Defaults to 4 if not provided.
 * @return {string} A randomly generated slot ID of the specified length.
 */
export function createSlotId(length: number = 4): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  const randomArray = new Uint8Array(length);
  crypto.getRandomValues(randomArray);
  for (const number of randomArray) {
    result += chars[number % chars.length];
  }
  return result;
}

export const adClickHandler: MouseEventHandler<HTMLDivElement> = (
  event: ReactMouseEvent<HTMLDivElement, MouseEvent>,
) => {
  GoogleAds.click(event.nativeEvent);
};
