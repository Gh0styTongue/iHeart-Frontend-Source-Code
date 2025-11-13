import type { Emitter } from '@iheartradio/web.utilities/create-emitter';
import type { Storage } from '@iheartradio/web.utilities/create-storage';
import { XMLParser } from 'fast-xml-parser';
import { isNonNullish } from 'remeda';

import {
  PlayerError,
  PlayerErrorCode,
  PlayerErrorMessages,
} from './player:error.js';
import type {
  AdPayload,
  Ads,
  PlayerProperties,
  Station,
} from './player:types.js';
import { AdType, StationType } from './player:types.js';
import { logger } from './utility:default-logger.js';
import { fetchVASTDocument } from './utility:process-in-stream-metadata.js';

function findKey<T extends string>(
  obj: Record<string, unknown>,
  keyToFind: T,
): T | undefined {
  if (Object.prototype.hasOwnProperty.call(obj, keyToFind)) {
    return obj[keyToFind] as T;
  }
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      const result: unknown = findKey(
        obj[key] as Record<string, unknown>,
        keyToFind,
      );
      if (result !== undefined) {
        return result as T;
      }
    }
  }
  return undefined;
}

export async function fetchAndParseVAST<T extends Station>({
  ads,
  payload,
  player,
  station,
}: {
  ads: Storage<Ads>;
  payload: AdPayload;
  player: Emitter<PlayerProperties<T>>;
  station: Station;
}) {
  const adRequestUrl = (() => {
    try {
      return new URL(payload.tag);
    } catch (error: unknown) {
      logger.error(
        error instanceof Error ? error.message : JSON.stringify(error),
      );
    }
  })();

  if (!adRequestUrl) {
    return null;
  }

  const { sessionstart, sessionid } = ads.deserialize();

  adRequestUrl.searchParams.append('correlator', String(Date.now()));
  adRequestUrl.searchParams.append('type', AdType.Midroll);

  if (
    station.type !== StationType.Live &&
    isNonNullish(sessionid) &&
    isNonNullish(sessionstart)
  ) {
    // Set the current `sessionstart` and `sessionid` values
    adRequestUrl.searchParams.set('sessionstart', sessionstart.toString());
    adRequestUrl.searchParams.set('sessionid', sessionid);

    // and then set `sessionstart` to false in the ads state, for subsequent requests
    // `sessionstart` gets reset to `true` in the `player.load` method, so new stations will
    // have `sessionstart: true` on their first post-roll ad request
    ads.set('sessionstart', false);

    // Google IMA plugin throws a fit when you ask it to fetch an ad payload from Triton
    // because of CORS issues, so now we just fetch the VAST document directly and load it
    // into JWPlayer through the `loadAdXml` method.
    try {
      // fetch the VAST response
      const adRequest = await fetchVASTDocument(adRequestUrl, logger);

      // If successful,
      if (adRequest?.status === 200) {
        const adXmlString = await adRequest.text();

        const parser = new XMLParser();

        const adXmlDocument = parser.parse(adXmlString);

        // and query for the root VAST node
        // const rootNode = adXmlDocument.querySelector('VAST');
        const rootNode = adXmlDocument['VAST'];

        // if it exists and has children (meaning there is an ad to play)
        if (rootNode) {
          const companionClickThroughs = [];
          // const adNodes = Array.from(rootNode.querySelectorAll('Ad'));
          const adNodes = rootNode['Ad'];

          try {
            for (const adNode of Array.isArray(adNodes) ? adNodes : [adNodes]) {
              const companionClickThrough = findKey(
                adNode,
                'CompanionClickThrough',
              );
              if (companionClickThrough) {
                companionClickThroughs.push(companionClickThrough);
              } else {
                companionClickThroughs.push(null);
              }
            }
          } catch (error: unknown) {
            logger.error(
              error instanceof Error ? error.message : JSON.stringify(error),
            );
          } finally {
            // Send the XML document to `player.loadXAdXml`. The corresponding method in JW
            // Player subscription will parse it back to a string. With that caveat, that it
            // only parses the `documentElement` into string, which in effect removes the top
            // line `<xml .../>` declaration, which seems to make JW Player choke (sometimes)
            player.loadAdXml({
              adPayload: payload,
              xmlDoc: new DOMParser().parseFromString(adXmlString, 'text/xml'),
              companionClickThroughs,
            });
            ads.set('current', {
              ...payload,
              tag: adRequestUrl.toString(),
            });
            ads.set('companionClickThroughs', companionClickThroughs);
          }
          // If there's no ad to play, just go to the next item in the queue
        } else {
          player.next(true);
        }

        // If the request to Triton was not 200, just go to the next item in the queue
      } else {
        player.next(true);
      }
    } catch (error: unknown) {
      logger.error(
        error instanceof Error ? error.message : JSON.stringify(error),
      );
      // If there was an error thrown in any of that, set a Midroll error on the player.
      // `player.setError` will call `player.next` if the code is Midroll, so no need to do
      // that here
      player.setError(
        PlayerError.new({
          code: PlayerErrorCode.Midroll,
          message: PlayerErrorMessages[PlayerErrorCode.Midroll],
        }),
      );
    }

    // This *shouldn't* ever execute, but if for some reason `sessionid` or `sessionstart`
    // are null and we aren't playing a Live station, go ahead and go to the next queue item
  } else if (station.type !== StationType.Live) {
    player.next(true);
  }

  return payload;
}
