import {
  primaryReload,
  secondaryHome,
  tertiaryClear,
} from '@iheartradio/web.remix-shared/error/blocks/error-cta-blocks.js';
import type { CTAItemData } from '@iheartradio/web.remix-shared/error/types/cta-props.js';
import type { UNKNOWN_ERROR_FACT } from '@iheartradio/web.remix-shared/error/types/error-display.js';

export const UNKNOWN_ERROR: UNKNOWN_ERROR_FACT = ({ root, pathname }) => ({
  TITLE: 'Something Went Wrong',
  DESCRIPTION: 'Try reloading the page or check back later.',
  ICON: 'error-outline',
  CTA: (({ root, pathname }) => {
    const defaultUnknownError: CTAItemData[] = [
      primaryReload,
      secondaryHome,
      tertiaryClear,
    ];
    if (root) {
      switch (pathname) {
        default: {
          return [defaultUnknownError[0], defaultUnknownError[2]];
        }
      }
    } else {
      switch (pathname) {
        case '/': {
          return [defaultUnknownError[0], defaultUnknownError[2]];
        }
        default: {
          return [...defaultUnknownError];
        }
      }
    }
  })({ root, pathname }),
});
