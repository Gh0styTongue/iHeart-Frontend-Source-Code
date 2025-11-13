import { Button } from '@iheartradio/web.accomplice/components/button';
import {
  PlayerTooltip,
  useFullScreenPlayer,
} from '@iheartradio/web.accomplice/components/player';
import {
  PresetsDrawerContent,
  PresetsDrawerTrigger,
} from '@iheartradio/web.accomplice/components/preset-list';
import { Preset } from '@iheartradio/web.accomplice/icons/preset';
import { useContext, useEffect, useState } from 'react';
import { useNavigation } from 'react-router';
import { useHydrated } from 'remix-utils/use-hydrated';

import { PRESETS_DRAWER_CONTAINER } from '~app/components/content-overlay';
import type { PresetCarouselId } from '~app/contexts/presets/presets-drawer';
import { PresetsDrawerContext } from '~app/contexts/presets/presets-drawer';
import { PresetsCarousel } from '~app/routes/_app/_index/components/presets-carousel';

export const PresetsDrawer = ({
  isInProfilePlayer = false,
  type,
}: {
  isInProfilePlayer?: boolean;
  type: PresetCarouselId;
}) => {
  const { isOpen: isProfilePlayerOpen } = useFullScreenPlayer();
  const { isOpen, setIsOpen } = useContext(PresetsDrawerContext);
  const navigation = useNavigation();
  const isHydrated = useHydrated();
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );

  // The Presets Drawer needs to remain open until manually dismissed.
  // The only exception is if the user navigates to a Now Playing/Profile Player page, we need to force the drawer closed.
  useEffect(() => {
    if (
      navigation.state === 'loading' &&
      navigation.location.pathname.includes('now-playing')
    ) {
      setIsOpen(false);
    }
  }, [navigation, setIsOpen]);

  useEffect(() => {
    if (isHydrated) {
      const container = document.querySelector<HTMLElement>(
        `#${PRESETS_DRAWER_CONTAINER}`,
      );
      if (container) {
        setPortalContainer(container);
      } else {
        console.warn(
          `Failed to find portal container #${PRESETS_DRAWER_CONTAINER}`,
        );
      }
    }
  }, [isHydrated]);

  return isHydrated && portalContainer ?
      <PresetsDrawerTrigger
        isOpen={isOpen}
        portalContainer={portalContainer}
        setIsOpen={setIsOpen}
      >
        <PlayerTooltip content="Presets">
          <Button
            aria-expanded={isOpen}
            color={isInProfilePlayer ? 'white' : 'default'}
            data-persist-pressed-state="true"
            kind={isInProfilePlayer ? 'primary' : 'tertiary'}
            onPress={() => setIsOpen(!isOpen)}
            size="icon"
          >
            <Preset size={isInProfilePlayer ? 36 : 32} />
          </Button>
        </PlayerTooltip>
        <PresetsDrawerContent
          isInProfilePlayer={isProfilePlayerOpen}
          // This `key` causes the drawer to re-render when opened to ensure all data in the component is fresh
          key={isOpen.toString()}
        >
          <PresetsCarousel isInDrawer navigateOnAction type={type} />
        </PresetsDrawerContent>
      </PresetsDrawerTrigger>
    : null;
};
