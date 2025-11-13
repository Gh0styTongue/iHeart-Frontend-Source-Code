import type { GetPresetsResponse } from '@iheartradio/web.api/amp';
import { createWebStorage } from '@iheartradio/web.utilities/create-storage';

export type Presets = GetPresetsResponse['presets'];

export const PresetsStorage = createWebStorage<Presets>({
  type: 'local',
  seed: {} as Presets,
  prefix: 'ihr:presets',
});
