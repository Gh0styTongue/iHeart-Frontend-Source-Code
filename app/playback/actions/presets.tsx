import type { FlexProps } from '@iheartradio/web.accomplice/components/flex';
import { Flex } from '@iheartradio/web.accomplice/components/flex';

import { PresetCarouselId } from '~app/contexts/presets/presets-drawer';

import { PresetsDrawer } from '../presets-drawer';

export const Presets = ({ ...props }: FlexProps) => {
  return (
    <Flex {...props}>
      <PresetsDrawer type={PresetCarouselId.Miniplayer} />
    </Flex>
  );
};
