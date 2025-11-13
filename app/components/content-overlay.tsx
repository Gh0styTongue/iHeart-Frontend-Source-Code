import { Box } from '@iheartradio/web.accomplice/components/box';
import { Grid } from '@iheartradio/web.accomplice/components/grid';
import { useFullScreenPlayer } from '@iheartradio/web.accomplice/components/player';
import { useLocation, useNavigation } from 'react-router';

import { PageLoader } from './page-loader';

// DO NOT REMOVE / CHANGE
// This is used as a ref for the Presets Drawer feature. This ID is how the drawer is rendered in the content portion of the app.
export const PRESETS_DRAWER_CONTAINER = 'presets-drawer-container';

// This covers the content area of the app only (excludes navigation + miniplayer) and is used as a portal reference for the `<PresetsDrawer />` component.
// This is so when the drawer is opened, it exists only within the content portion of the app and doesn't cover the navigation + miniplayer.
export function ContentOverlay() {
  const { isOpen: isFullScreen } = useFullScreenPlayer();
  const navigation = useNavigation();
  const location = useLocation();

  const isNavigating =
    Boolean(navigation.location) &&
    location.pathname !== navigation.location?.pathname;

  return (
    <Grid
      gridTemplateAreas='"container"'
      height="100vh"
      left="0"
      paddingBottom={{ mobile: '5.9rem', large: isFullScreen ? 0 : '8.8rem' }}
      paddingLeft={{ mobile: 0, large: '31.6rem' }}
      paddingTop={{ mobile: '4.8rem', large: 0 }}
      pointerEvents="none"
      position="fixed"
      top="0"
      width="100vw"
      zIndex={{ mobile: '3', large: '5' }}
    >
      <PageLoader loading={isNavigating} />
      <Box gridArea="container" id={PRESETS_DRAWER_CONTAINER} zIndex="2"></Box>
    </Grid>
  );
}
