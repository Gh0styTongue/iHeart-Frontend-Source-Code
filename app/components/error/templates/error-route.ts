import {
  primaryHome,
  primaryReload,
  secondaryHome,
  secondaryLogin,
  tertiaryClear,
} from '@iheartradio/web.remix-shared/error/blocks/error-cta-blocks.js';
import type { CTAItemData } from '@iheartradio/web.remix-shared/error/types/cta-props.js';
import type {
  ErrorDisplayProps,
  ErrorProps,
  ROUTE_API_ERROR_FACT,
} from '@iheartradio/web.remix-shared/error/types/error-display.js';
import { isEmpty, isPlainObject } from 'remeda';

const JwtErrorCodes = Object.freeze(new Set([100, 101, 102]));

// Get whether or not this error is caused by JWT
const isJwtError = (data: ErrorProps['data']) => {
  if (isPlainObject(data) && 'errorCode' in data) {
    return JwtErrorCodes.has(Number(data.errorCode));
  }
  return false;
};

// Get ErrorDisplayProps for 400's
const get400ErrorConfig = ({ data }: ErrorProps): ErrorDisplayProps => {
  const isAuthError = isJwtError(data);
  const withError =
    data?.error && !isEmpty(data.error) ? `"${data.error}" - ` : '';
  const descriptionText =
    isAuthError ?
      'There was an error with authentication. Please contact the administrator of this application. More information is available in the console.'
    : 'If this error occurs again, please clear your cookies';
  const DESCRIPTION = `${withError}${descriptionText}`;

  return {
    TITLE:
      isAuthError ? 'Could not complete authentication' : 'There was an error',
    DESCRIPTION,
    ICON: 'error-outline',
    CTA: [primaryReload, tertiaryClear],
  };
};

const get404ErrorConfig = ({
  pathname,
  root,
}: ErrorProps): ErrorDisplayProps => {
  const isNoFavorites = pathname.startsWith('/favorites');

  return {
    TITLE:
      isNoFavorites ? 'Favorites Radio is just a day away' : `Page Not Found`,
    DESCRIPTION:
      isNoFavorites ?
        "Continue listening and we'll have a great mix of music for you tomorrow"
      : `Sorry, we can't find the page you're looking for.`,
    ICON: isNoFavorites ? 'radio' : 'error-outline',
    CTA: (({ root, pathname }) => {
      const default404: CTAItemData[] = [primaryHome];

      if (root) {
        switch (pathname) {
          default: {
            return [];
          }
        }
      } else {
        switch (pathname) {
          case '/': {
            return [];
          }
          default: {
            return [...default404];
          }
        }
      }
    })({ root, pathname }),
    ...(isNoFavorites ? { HIDE_STATUS: true } : {}),
  };
};

export const ROUTE_API_ERROR: ROUTE_API_ERROR_FACT = ({
  root,
  pathname,
  data,
}) => ({
  400: get400ErrorConfig({ data, pathname }),
  401: {
    TITLE: `Your Session Timed Out`,
    DESCRIPTION: `Please log in or reload the page to continue listening.`,
    ICON: 'error-outline',
    CTA: (({ root, pathname }) => {
      const default401: CTAItemData[] = [
        primaryReload,
        secondaryLogin,
        tertiaryClear,
      ];

      if (root) {
        switch (pathname) {
          default: {
            return [...default401];
          }
        }
      } else {
        switch (pathname) {
          default: {
            return [...default401];
          }
        }
      }
    })({ root, pathname }),
  },
  403: {
    TITLE: `Your Session Timed Out`,
    DESCRIPTION: `Please reload the page to continue listening.`,
    ICON: 'error-outline',
    CTA: (({ root, pathname }) => {
      const default403: CTAItemData[] = [primaryReload, tertiaryClear];

      if (root) {
        switch (pathname) {
          default: {
            return [...default403];
          }
        }
      } else {
        switch (pathname) {
          default: {
            return [...default403];
          }
        }
      }
    })({ root, pathname }),
  },
  404: get404ErrorConfig({ data, pathname, root }),
  408: {
    TITLE: `Request Timeout`,
    DESCRIPTION: `Sorry, this is taking longer than expected. Try reloading the page or check back later.`,
    ICON: 'error-outline',
    CTA: (({ root, pathname }) => {
      const default408: CTAItemData[] = [
        primaryReload,
        secondaryHome,
        tertiaryClear,
      ];

      if (root) {
        switch (pathname) {
          default: {
            return [default408[0], default408[2]];
          }
        }
      } else {
        switch (pathname) {
          case '/': {
            return [default408[0], default408[2]];
          }
          default: {
            return [...default408];
          }
        }
      }
    })({ root, pathname }),
  },
  500: {
    TITLE: `Internal Server Error`,
    DESCRIPTION: `Sorry, we couldn't complete your request. Please check back later.`,
    ICON: 'error-outline',
    CTA: (({ root, pathname }) => {
      const default500: CTAItemData[] = [
        primaryReload,
        secondaryHome,
        tertiaryClear,
      ];

      if (root) {
        switch (pathname) {
          default: {
            return [default500[0], default500[2]];
          }
        }
      } else {
        switch (pathname) {
          case '/': {
            return [default500[0], default500[2]];
          }
          default: {
            return [...default500];
          }
        }
      }
    })({ root, pathname }),
  },
  503: {
    TITLE: `Service Not Available`,
    DESCRIPTION: `Sorry, we couldn't complete your request. Try reloading the page or check back later.`,
    ICON: 'error-outline',
    CTA: (({ root, pathname }) => {
      const default503: CTAItemData[] = [
        primaryReload,
        secondaryHome,
        tertiaryClear,
      ];

      if (root) {
        switch (pathname) {
          default: {
            return [default503[0], default503[2]];
          }
        }
      } else {
        switch (pathname) {
          case '/': {
            return [default503[0], default503[2]];
          }
          default: {
            return [...default503];
          }
        }
      }
    })({ root, pathname }),
  },
  504: {
    TITLE: `Request Timeout`,
    DESCRIPTION: `Sorry, this is taking longer than expected. Try reloading the page or check back later.`,
    ICON: 'error-outline',
    CTA: (({ root, pathname }) => {
      const default504: CTAItemData[] = [
        primaryReload,
        secondaryHome,
        tertiaryClear,
      ];

      if (root) {
        switch (pathname) {
          default: {
            return [default504[0], default504[2]];
          }
        }
      } else {
        switch (pathname) {
          case '/': {
            return [default504[0], default504[2]];
          }
          default: {
            return [...default504];
          }
        }
      }
    })({ root, pathname, data }),
  },
});
