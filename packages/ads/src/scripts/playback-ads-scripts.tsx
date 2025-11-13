import { loadScript, waitUntil } from '@iheartradio/web.utilities';
import { createEmitter } from '@iheartradio/web.utilities/create-emitter';
import { useEffect } from 'react';

import type { ScriptDescriptor } from './types.js';

declare global {
  interface Window {
    tdIdsync: {
      load_script: (source: string) => Promise<void>;
      load_pixel: (source: string) => Promise<void>;
    };
    tritonIdSync: {
      load_script: (source: string) => Promise<void>;
      load_pixel: (source: string) => Promise<void>;
    };
  }
}

/**
 * We need to be be able to capture just how many pixels Triton wants to load and know when it's
 * "finished", so we can wait until that is complete because it actually *does* matter if the
 * Triton sync is complete before attempting playback. The script loaded from `tritonScript`
 * itself loads ANother script which in turns loads a lot of pixels. It sets some properties w/
 * methods on the window object - so we are hijacking that to use our emitter functions created
 * above so that we can be sure it's finished before proceeding. I wish we could do this in a
 * less un-appetizing way ... but iiwii [DEM 2024/04/09]
 */
const TritonHelper = createEmitter({
  load_pixel: (source: string) => {
    return new Promise<void>(resolve => {
      const img =
        /MSIE \d+\.\d+;/.test(navigator.userAgent) ?
          new Image()
        : document.createElement('img');

      img.src = source;
      img.width = 0;
      img.height = 0;
      img.alt = '';
      img.className = 'triton-pixel';
      img.addEventListener('load', () => resolve());
      img.addEventListener('error', error => {
        console.warn(`Could not load Triton Pixel: ${source}`, error);
        resolve();
      });

      document.body.append(img);
    });
  },
  load_script: (source: string) => {
    return new Promise<void>(resolve => {
      const js = document.createElement('script');
      js.type = 'text/javascript';
      js.src = source;
      js.addEventListener('load', () => resolve());
      js.addEventListener('error', error => {
        console.warn(`Could not load Triton Script: ${source}`, error);
        resolve();
      });

      document.head.append(js);
    });
  },
});

export const PlaybackAdsScripts = ({
  tritonScript,
  usPrivacy,
}: {
  tritonScript: string;
  usPrivacy: string;
}) => {
  const isBrowser = globalThis.window?.document !== undefined;

  useEffect(() => {
    if (!isBrowser) return;

    globalThis.window.tdIdsync = {
      load_pixel: TritonHelper.load_pixel,
      load_script: TritonHelper.load_script,
    };

    globalThis.window.tritonIdSync = {
      load_pixel: TritonHelper.load_pixel,
      load_script: TritonHelper.load_script,
    };

    const tritonScriptUrl = new URL(tritonScript);
    tritonScriptUrl.searchParams.append('us_privacy', usPrivacy);

    const playbackAdsScripts: ScriptDescriptor[] = [
      {
        async: true,
        id: 'triton',
        src: tritonScriptUrl.toString(),
        target: document.body,
      },
    ];

    Promise.allSettled(
      playbackAdsScripts.map(({ src, ...rest }) => loadScript(src, rest)),
    )
      .then(() => waitUntil(() => TritonHelper.flushing === false))
      .catch((error: unknown) => {
        if (error instanceof Error) {
          console.warn(
            'Timeout exceeded while waiting for Triton Cookie Sync, continuing...',
          );
        }
      });
  }, [isBrowser, tritonScript, usPrivacy]);

  return null;
};
