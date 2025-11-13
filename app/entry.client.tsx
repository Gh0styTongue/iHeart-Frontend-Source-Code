// import './wdyr';

import { proxyImage } from '@iheartradio/web.remix-shared/client';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

import { AppsFlyerSdkProvider } from './hooks/use-apps-flyer';
import { polyfill } from './utilities/polyfill';

polyfill();

const registerServiceWorker = async () => {
  // Short Circuit CDN URL in production, relative path for all other envs (proxied via server to avoid CORS)
  // Service workers must be same-origin, so all other envs (req originated from vcl (not prod), compute, RE origin, local) uses proxy middleware
  const s3ServiceWorkerUrl =
    'https://www.iheart.com/public/listen/serviceWorker.js';
  const originServiceWorkerUrl = '/serviceWorker.js';

  const serviceWorkerUrl =
    (
      window.location.hostname === 'www.iheart.com' ||
      window.location.hostname === 'iheart.com'
    ) ?
      s3ServiceWorkerUrl
    : originServiceWorkerUrl;

  navigator.serviceWorker.register(serviceWorkerUrl, {
    scope:
      serviceWorkerUrl === originServiceWorkerUrl ? '/' : '/public/listen/',
    updateViaCache: 'none',
  });
};

if ('serviceWorker' in navigator) {
  if (window.document.readyState === 'complete') {
    registerServiceWorker();
  } else {
    window.addEventListener('load', () => {
      registerServiceWorker();
    });
  }
}

// Execute the ImageProxy shim from `@iheartradio/web.remix-shared/client`
proxyImage();

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <AppsFlyerSdkProvider>
        <HydratedRouter />
      </AppsFlyerSdkProvider>
    </StrictMode>,
  );
});
