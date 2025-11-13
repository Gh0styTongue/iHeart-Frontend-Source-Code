import type { Logger } from '@iheartradio/web.utilities/create-logger';
import { createSafeTimeout } from '@iheartradio/web.utilities/safe-timeout';
import { HTMLResource, IFrameResource, StaticResource } from 'iab-vast-model';
import parseVAST from 'iab-vast-parser';
import QuickLRU from 'quick-lru';
import {
  clone,
  isEmpty,
  isNonNullish,
  isNullish,
  omit,
  once,
  prop,
} from 'remeda';

import {
  AdFormat,
  AdPlayerStatus,
  AdType,
  ValidCompanionResourceTypes,
} from './player:schemas.js';
import type {
  Api,
  Player,
  Station as PlaybackStation,
} from './player:types.js';
import {
  type CommentAdMarkers,
  type CompanionAd,
  type CompanionEvents,
  type CompanionVAST,
  type CreativeEvents,
  type CreativeWithCompanion,
  type ParsedComment,
  type ProcessedCompanions,
  type ProcessedMetadata,
  type RawMetadata,
  VASTPerformanceMarkers,
} from './utility:process-in-stream-metadata.types.js';

// Only store the information about the track that we care about for generating meta
type Track = {
  artistId: number;
  artistName: string;
  trackId: number;
  trackName: string;
};

// SafeTimeout utility that prevents us from doing dumb stuff like setting multiple timeouts
// for the same identifier, as well as returning a convenience function `cancel` from the
// `SafeTimeout.set` method. We use these cancel functions if the player is stopped during live
// in-stream ad playback to stop any queued time events from firing. Exporting from this file
// in order to be able to spy on the methods in test.
export const SafeTimeout = createSafeTimeout();

// LRU Cache to store track information, as the memoized function that was here previously
// is more memory-hungry than an LRU
const tracksCache = new QuickLRU<number, Track>({ maxSize: 1000 });

export const getTrackMeta = async (
  trackId: number,
  amp: Api,
): Promise<Track | undefined> => {
  if (tracksCache.has(trackId)) {
    return tracksCache.get(trackId);
  } else {
    const track = await amp.api.v3.catalog
      .getTracks({
        params: { ids: [trackId] },
      })
      .then(prop('body'))
      .then(prop('tracks'))
      .then(tracks => tracks.find(track => track.id === trackId));

    if (track) {
      const trackToStore: Track = {
        artistId: track.artistId,
        artistName: track.artistName,
        trackId: track.id,
        trackName: track.title,
      };
      tracksCache.set(trackId, trackToStore);
      return trackToStore;
    }
  }
};

/**
 * This function parses `COMM` messages that come in from `jwplayer.on("metadataCueParsed")` event
 * `COMM` messages can hold a myriad of different values, but the only ones we care about in this
 * context are [`adContext`,`ENGadContext`], `spotBlockMarker` and `adMarkers`.
 */

export function parseCommentMetadata(
  comment: string,
  logger: Logger,
): ParsedComment {
  SafeTimeout.setLogger(logger);

  return (
    comment
      // Split the comment into all its parts, the separate blocks
      // (adContext, spotBlockMarker, adMarkers) are separated by a single space
      .split(/\s/)
      // Then reduce the parts by...
      .reduce((accumulator, part) => {
        // Splitting on '=', and removing the escaped slashes and double-quotues
        // the capturing group after '=' allows the `value` portion of the split to contain
        // any '=' that may be in that part of the string, and not split initially on those '=' characters
        const [key, value] = part
          .split(/=(.*)/)
          .map(value => value.replaceAll('\\', '').replaceAll('"', ''));

        // if there's no value, return early
        if (!value) return accumulator;

        // if the key includes 'adContext' (it can be "ENGadContext", or just "adContext"), idk why 🤷🏽‍♂️
        if (key.includes('adContext')) {
          // then try to decode the value with `atob`
          try {
            return { ...accumulator, adContext: window.atob(value) };
          } catch (error: unknown) {
            const errorObject =
              error instanceof Error ? error
                // A note about the pattern you see below... the `catch` clause parameter MUST be
                // `unknown`, so it's impossible to call `.toString()` on it directly... BUT if it
                // has a `.toString()` method, applying `String.prototype.toString` will invoke that
                // function and give us the string value we want. If it does NOT have `.toString()`
                // method, the Object prototype (which String inherits from) takes over and gives
                // us a string back anyway (usually `[object Object]`, but that's better than nothing)
              : new Error(String.prototype.toString.apply(error));

            // if it fails, set the adContext to null and log a warning
            logger.warn(`Failed to decode adContext, ${errorObject.message}`);
            return { ...accumulator, adContext: null };
          }
          // else if the key is `adMarkers`
        } else if (key === 'adMarkers') {
          // `adMarkers` can contain information for *multiple* ads separated by pipe '|'
          // Split the segments based on pipe and reduce
          const segments = value
            .split('|')
            .reduce((segmentAccumulator, currentSegment) => {
              // Split the currentSegment by ',' - it is a comma-delimited list of '<key>=<value>',
              // and reduce again
              const markers = currentSegment
                .split(',')
                .reduce((accumulator, adMarker) => {
                  // split on '=' to separate the key and value, removing single quote delimeters
                  const [key, value] = adMarker
                    .split(/=/)
                    .map(value => value.replaceAll("'", ''));

                  // if there's no value, return early
                  if (!value) return accumulator;

                  // else attempt to JSON parse the value, so that it will be the correct type
                  // (number, string)
                  try {
                    return { ...accumulator, [key]: JSON.parse(value) };

                    // if that fails, just return the string value (since that what
                    // `currentSegment.split` gives us) and log a warning
                  } catch {
                    logger.warn(
                      'Failed to JSON.parse adMarker value in processStreamMetadata',
                      value,
                    );
                    return { ...accumulator, [key]: value };
                  }
                }, {} as CommentAdMarkers);
              return [...segmentAccumulator, markers];
            }, [] as CommentAdMarkers[]);

          // set the `adMarkers` key to what we parsed
          return { ...accumulator, [key]: segments };

          // if the key is `spotBlockMarker`, parse it out. We don't use the same logic as above
          // as `spotBlockMarker` will only ever be a single value, so we don't need the nested
          // reduce on pipe split as we do above
        } else if (key === 'spotBlockMarker') {
          const markers = value.split(',').reduce(
            (accumulator, adMarker) => {
              // split on '=' to separate the key and value, removing single quote delimeters
              const [key, value] = adMarker
                .split(/=/)
                .map(value => value.replaceAll("'", ''));

              // if there's no value, return early
              if (!value) return accumulator;

              // else attempt to JSON parse the value, so that it will be the correct type
              // (number, string)
              try {
                return { ...accumulator, [key]: JSON.parse(value) };

                // if that fails, just return the string value and log a warning
              } catch {
                logger.warn(
                  'Failed to JSON.parse spotBlockMarker value in processStreamMetadata',
                  value,
                );
                return { ...accumulator, [key]: value };
              }
            },
            {} as ParsedComment['spotBlockMarker'],
          );

          // set the `spotBlockMarker` key to what we parsed
          return { ...accumulator, [key]: markers };
        } else {
          // if it's a key we don't care about, just return the accumulator
          return accumulator;
        }
      }, {})
  );
}

/**
 * This function gets called from the `jwplayer.on("metadataCueParsed") handler, after we have
 * parsed and returned the companions/events from `processInStreamMetadata`.
 *
 * It starts the process by setting a timeout that: renders any companions, and sets up time events
 * to fire after calculated delays. The initial timeout is delayed by a value that is calculated
 * in `processStreamMetadata`, and you can read more about that process there.
 */
export function setLiveStreamCompanion<Station extends PlaybackStation>({
  liveInStreamAdPayload,
  player,
  logger,
  delay = 0,
  identifier,
  offsetTimeEvents = 0,
}: {
  liveInStreamAdPayload: CompanionVAST;
  player: Player<Station>;
  logger: Logger;
  delay: number;
  identifier: string | number;
  offsetTimeEvents?: number;
}) {
  SafeTimeout.setLogger(logger);

  // Get a deep clone of the arguments as they exist at the time of function invocation
  const { duration, creatives, tag } = clone(
    liveInStreamAdPayload,
  ) as CompanionVAST;

  // 2️⃣ If we don't have a duration, all this is moot, so return early
  if (!duration) {
    logger.warn('No duration available for live in-stream ad');
    return;
  }

  // Start the whole process after the delay calculated from `processInStreamMetadata`.
  // This is done with an IIFE so that we can "time-shift" some values. Meaning, we want
  // the values of: `liveInStreamAdPayload`, `delay`, `identifier` and `offsetTimeEvents` as they
  // exist when this function expression is invoked, but we want the state of `player` to be as it
  // is when the timeout function executes. If there's a better pattern for this, I'm all ears 🦻🏽
  ((
    {
      duration,
      creatives,
      tag,
    }: {
      // Redefine the type inline, because we know at this point that duration is not null or
      // undefined based on the test 2️⃣ 👆🏼
      duration: Exclude<CompanionVAST['duration'], null | undefined>;
      creatives: CompanionVAST['creatives'];
      tag: CompanionVAST['tag'];
    },
    delay: number,
    identifier: string,
    offsetTimeEvents: number = 0,
  ) => {
    SafeTimeout.set(
      `render-livestream-ad-${identifier}`,
      () => {
        const ads = player.getAds();

        // Get the companion ad we want to render, in order of preference:
        // 1 - HTML
        // 2 - Static
        // 3 - IFrame
        const companionToRender =
          creatives.HTML ?? creatives.STATIC ?? creatives.IFRAME ?? undefined;

        // If we have a companion that we want to render...
        if (companionToRender) {
          // ---------------------------------------------------------------------------------------
          // Set up utility functions to fire the `creativeView` events if they exist on any of the
          // displayed companions
          // ---
          // This is a factory that creates a `once`-d function for each creativeView pixel. If the
          // document is visible when this is triggered below and then the visibility state changes
          // to hidden and then back to visible, we don't want multiple `creativeView` pixels to be
          // fired for the same uri.
          const creativeViewPixels = (function creativeViewEventsFactory() {
            // return an array of functions that will fire the creativeView pixel for each uri
            // provided in the VAST response for the companion resource we chose to render (above)
            return (
              companionToRender.creative.events?.creativeView?.reduce(
                (accumulator, event, index) => {
                  return [
                    ...accumulator,
                    // wrap the pixel logic in `once` so that it can only be invoked a single time
                    once(() => {
                      const { uri } = event;

                      logger.info(
                        `Firing creativeView pixel for ${identifier} - ${index}`,
                        { uri },
                      );

                      const pixel = document.createElement('img');
                      pixel.src = uri;
                      pixel.height = 1;
                      pixel.width = 1;

                      pixel.addEventListener('load', () => pixel.remove());

                      document.body.append(pixel);
                    }),
                  ];
                },
                [] as Array<() => void>,
              ) ?? [] // nullishly-coalesce with an empty array if there are no `creativeView`s
            );
          })();

          // ---
          // Create an event listener handler that can be added and removed
          const visibilitychangeCreativeViewHandler = () => {
            if (document.visibilityState === 'visible') {
              logger.info(
                `Firing 'visibilitychange' handler for ${identifier}`,
              );
              for (const fire of creativeViewPixels) {
                fire();
              }
            }
          };
          // ---------------------------------------------------------------------------------------
          const visibilityChangeAbortController = new AbortController();

          if (companionToRender.creative && !isEmpty(tag)) {
            logger.info(`Rendering livestream ad break: ${identifier}`);

            // Create a 'current' ad
            const current = {
              type: AdType.Instream,
              format: AdFormat.Live,
              companions: [
                // This is an array because in the future-we could potentially have multiple ad
                // slots on a page
                omit(companionToRender.creative, ['events']),
              ],
              tag,
            };

            // And serialize the ads state so that the GAM ad will disappear and the companion ad will render
            ads.serialize({
              ...ads.deserialize(),
              type: 'audio',
              status: AdPlayerStatus.Streaming,
              current,
            });

            // If the document is visible, fire off the 'creativeView' events
            if (document.visibilityState === 'visible') {
              for (const fire of creativeViewPixels) {
                fire();
              }
            }

            // add an event listener to fire the creativeView events if the browser becomes visible
            // during the ad break
            document.addEventListener(
              'visibilitychange',
              visibilitychangeCreativeViewHandler,
              { signal: visibilityChangeAbortController.signal },
            );
          } else {
            logger.warn(
              `No companion to render for live in-stream ad - ${identifier}`,
              {
                companion: liveInStreamAdPayload,
              },
            );
          }

          const unsubscribeLiveAdSubscription = player.subscribe({
            // If the player is stopped, cancel all pending time events, and unsubscribe this
            // entire subscription, restore the ads state, remove the visibilitychange event listener
            stop() {
              logger.info(
                `Playback stopped during live ad break ${identifier}, cleaning up...`,
              );

              visibilityChangeAbortController.abort();

              ads.serialize({
                ...ads.deserialize(),
                status: AdPlayerStatus.Idle,
                current: undefined,
              });
              unsubscribeLiveAdSubscription();
            },
            setMute(muted) {
              if (isNullish(muted)) return;

              // If the player is muted and there are mute events
              if (muted === true && companionToRender.companion.events?.mute) {
                for (const muteEvent of companionToRender.companion.events
                  .mute) {
                  const { uri } = muteEvent;

                  const pixel = document.createElement('img');
                  pixel.src = uri;
                  pixel.width = 1;
                  pixel.height = 1;

                  // After the pixel has loaded, remove it from the dom
                  pixel.addEventListener('load', () => pixel.remove());

                  document.body.append(pixel);
                  logger.info(
                    `Rendering livestream ad - ${identifier} - event: mute`,
                    { uri },
                  );
                }
                // If the player is unmuted and there are unmute events
              } else if (
                muted === false &&
                companionToRender.companion.events?.unmute
              ) {
                for (const unmuteEvent of companionToRender.companion.events
                  .unmute) {
                  const { uri } = unmuteEvent;

                  const pixel = document.createElement('img');
                  pixel.src = uri;
                  pixel.width = 1;
                  pixel.height = 1;

                  // After the pixel has loaded, remove it from the dom
                  pixel.addEventListener('load', () => pixel.remove());

                  document.body.append(pixel);
                  logger.info(
                    `Rendering livestream ad - ${identifier} - event: unmute`,
                    { uri },
                  );
                }
              }
            },
          });

          // Set a timeout to unsubscribe after the duration has elapsed, restore the ads state
          // and remove the visibilitychange event listener
          SafeTimeout.set(
            `livestream-companion-cleanup-${identifier}`,
            () => {
              logger.info(
                `Livestream ad break: ${identifier}, elapsed, cleaning up...`,
              );
              unsubscribeLiveAdSubscription();
              player.adComplete(AdType.Instream);
              document.removeEventListener(
                'visibilitychange',
                visibilitychangeCreativeViewHandler,
              );
            },
            duration - offsetTimeEvents,
          );
        }
      },
      delay,
    );
  })({ duration, creatives, tag }, delay, String(identifier), offsetTimeEvents);
}

export async function fetchVASTDocument(
  url: URL,
  logger: Logger,
): Promise<Response | null> {
  // Intermittently, there are unhandle promise rejection errors stemming from this logic.
  // Rather than clutter up `getInstreamVAST` with nested try/catch, the fetching and handling
  // of any errors is handled in this method.
  // Additionally, adding an AbortSignal set to timeout after 3s [DEM 2025/07/14]
  try {
    return await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(3000),
    });
  } catch (error: unknown) {
    if (error instanceof DOMException) {
      if (error.name === 'TimeoutError') {
        logger.warn('Fetching VAST Document timed out');
      } else if (error.name === 'AbortError') {
        logger.warn('Fetching VAST document was user-aborted');
      } else {
        logger.warn(`${error.name}: ${error.cause ?? 'unknown'}`);
      }
    } else if (error instanceof Error) {
      logger.warn(error.message);
    } else {
      logger.warn(JSON.stringify(error));
    }

    performance.clearMarks(VASTPerformanceMarkers.Start);
    return null;
  }
}

export async function getInstreamVAST(
  adContext: string,
  logger: Logger,
): Promise<CompanionVAST[] | undefined> {
  SafeTimeout.setLogger(logger);

  let vastUrl: URL;

  // Clear the previous marks
  performance.clearMarks(VASTPerformanceMarkers.Start);
  performance.clearMarks(VASTPerformanceMarkers.End);

  // Mark the start of this process
  performance.mark(VASTPerformanceMarkers.Start);

  try {
    vastUrl = new URL(adContext);
  } catch (error: unknown) {
    const errorObject =
      error instanceof Error ? error : (
        new Error(String.prototype.toString.apply(error))
      );
    logger.error(
      `Unable to create VAST URL from adContext parameter: ${adContext}, ${errorObject.message}`,
    );
    performance.clearMarks(VASTPerformanceMarkers.Start);
    return;
  }

  const vastResponse = await fetchVASTDocument(vastUrl, logger);

  // If we got a VAST response, then parse it and conform it to our `CompanionVAST` type
  if (vastResponse?.status === 200) {
    try {
      const textContent = await vastResponse.text();

      const vastParsed = parseVAST(textContent);

      const vastObjects: CompanionVAST[] = [];

      const volumeEventKeys = ['mute', 'unmute'] as const;
      const creativeEventKeys = ['creativeView'] as const;

      if (!vastParsed.ads) {
        return;
      }

      // For each ad item
      for (const adItem of vastParsed.ads) {
        const vastObject: CompanionVAST = {
          id: adItem.id,
          creatives: {},
          tag: vastUrl.toString(),
        };

        const companionEvents: CompanionEvents = {};

        // For each Creative associated to that ad item
        for (const creative of adItem.creatives) {
          // If the creative is Linear object (i.e., the audio playing in the live stream)
          if (creative.linear) {
            // We want to get the duration (in seconds) and set it on our object in milliseconds
            vastObject.duration = Number(creative.linear.duration) * 1000;

            // If there are tracking events associated
            if (creative.linear.trackingEvents) {
              // Then for all the ones we care about
              for (const event of volumeEventKeys) {
                // Get the tracking event configuration
                const trackingEvent = creative.linear.trackingEvents.get(event);

                // It *could* be an array if there are multiple endpoints that need to be hit for each event
                if (Array.isArray(trackingEvent)) {
                  // So create an array to hold the uri and offset
                  const events = [];
                  for (const eventItem of trackingEvent) {
                    const uri = eventItem.uri;

                    events.push({
                      uri,
                    });
                  }
                  // set all the events onto the vastObject tracking events key,
                  // spreading whatever might be present already
                  if (
                    volumeEventKeys.includes(event as keyof CompanionEvents)
                  ) {
                    const eventKey = event as keyof CompanionEvents;
                    companionEvents[eventKey] = [
                      ...(companionEvents[eventKey] ?? []),
                      ...events,
                    ];
                  }
                } else {
                  // If not an array, conform it to the array shape
                  if (
                    volumeEventKeys.includes(event as keyof CompanionEvents)
                  ) {
                    const eventKey = event as keyof CompanionEvents;
                    companionEvents[eventKey] = [
                      ...(companionEvents[eventKey] ?? []),
                      trackingEvent,
                    ];
                  }
                }
              }
            }

            // else if the creative includes companions (Linear and CompanionAds will never be in the
            // same Creative block)
          } else if (creative.companionAds) {
            // For each companionAd
            for (const companion of creative.companionAds.companions) {
              // Get the necessary values
              const {
                id,
                height,
                width,
                altText,
                resource,
                clickThrough,
                trackingEvents,
              } = companion;
              const { uri, creativeType } = resource;
              const resourceType =
                resource instanceof StaticResource ?
                  ValidCompanionResourceTypes.Static
                : resource instanceof HTMLResource ?
                  ValidCompanionResourceTypes.HTML
                : resource instanceof IFrameResource ?
                  ValidCompanionResourceTypes.IFrame
                : undefined;

              const events = {} as CreativeEvents;

              // For each "companion" event we want to fire (currently only `creativeView`)
              for (const event of creativeEventKeys) {
                // Get that event from the `trackingEvents` on the companion
                const trackingEvent = trackingEvents.get(event);

                // If we got a tracking event, and it is an array
                if (trackingEvent && Array.isArray(trackingEvent)) {
                  // Then reduce all the event URIs into an array for this event
                  events[event] = trackingEvent.reduce(
                    (accumulator, event_) => {
                      return [...accumulator, { uri: event_.uri }];
                    },
                    [],
                  );

                  // else if we got a tracking event and it's not an array, just add it to the event
                  // key in array form (to reduce logic complexity later we want everything to have
                  // the same shape)
                } else if (trackingEvent) {
                  events[event] = [{ uri: trackingEvent.uri }];
                }
              }

              // If we have a clickThrough, we know we will need to render an <a> around the Static
              // Resource image
              const hasClickThrough = isNonNullish(clickThrough?.uri);

              const companionAd: CompanionAd = {
                id,
                height,
                width,
                altText,
                uri,
                events: companionEvents,
                // Only include the clickThrough uri if we have one
                ...(hasClickThrough ? { clickThrough: clickThrough.uri } : {}),
                // Only include 'creativeType' if the resource is a `StaticResource` (other types don't have that key)
                ...(resource instanceof StaticResource ? { creativeType } : {}),
              };

              // This section is to conform the Live Companion into the same data shape that Custom
              // Companions use so that the ad slots can display it without extra logic
              const content =
                // if the resource is `StaticResource`
                resourceType === ValidCompanionResourceTypes.Static ?
                  // and if `hasClickThrough`
                  `${
                    hasClickThrough ?
                      // add an opening <a> tag
                      `<a href="${clickThrough.uri}" target="_blank">`
                      // else, add nothing
                    : ''
                    // add the img tag with appropriate attributes
                  }<img src="${uri}" alt="${altText}" width="${width}" height="${height}" />${
                    // and if `hasClickThrough`, add the closing </a> tag
                    hasClickThrough ? '</a>' : ''
                  }`
                  // If the resource is `IFrameResource`
                : resourceType === ValidCompanionResourceTypes.IFrame ?
                  // add the <iframe> tag with appropriate attributes
                  `<iframe src="${uri}" frameborder="0" width="${width}" height="${height}" />`
                : resourceType === ValidCompanionResourceTypes.HTML ? uri
                  // else the resource is something we don't currently support (JavascriptResource)
                  // or will never support (FlashResource), so just set to `undefined` so ad slot
                  // will not attempt to render anything
                : undefined;

              // This is where we conform the data to the same shape that Custom Companions use
              // some of the properties are redundant, but iiwii 🤷🏽‍♂️
              const creativeWithCompanion: CreativeWithCompanion = {
                creative: {
                  size: {
                    width,
                    height,
                  },
                  resourceType,
                  content,
                  height,
                  width,
                  events,
                },
                companion: companionAd,
              };

              if (isNonNullish(resourceType)) {
                vastObject.creatives[resourceType] = creativeWithCompanion;
              }
            }
          }
        }

        // push the `vastObject` onto our `vastObjects` array
        vastObjects.push(vastObject);
      }

      // Mark the end of this process and return our `vastObjects`
      performance.mark(VASTPerformanceMarkers.End);
      return vastObjects;

      // If any error was thrown, log an error and clear the start mark
    } catch (error: unknown) {
      const errorObject =
        error instanceof Error ? error : (
          new Error(String.prototype.toString.apply(error))
        );
      logger.error(
        'Unable to parse VAST object from live stream comment',
        errorObject.message,
      );
      performance.clearMarks(VASTPerformanceMarkers.Start);
    }

    // else, log an error that fetching the adContext failed and clear the start mark
  } else {
    performance.clearMarks(VASTPerformanceMarkers.Start);
    logger.error(`Fetchhing adContext: ${adContext} failed`);
  }
}

// This Map is a "holding tank" for adMarkers that come through the pipeline before the accompanying
// adContext comes through. We need those adMarkers to accurately time the display of the companions
// see the note about ridiculousness below... 1️⃣
// This is exported, so that test isolation can be ensured
export const ParsedAdMarkers = new Map<string | number, CommentAdMarkers>();

export async function processInStreamMetadata(
  { COMM }: RawMetadata,
  logger: Logger,
): Promise<ProcessedMetadata | undefined> {
  SafeTimeout.setLogger(logger);

  // This a `COMM` message - it likely contains information about upcoming ads
  if (isNonNullish(COMM)) {
    // Tracking object for whether a particular ad identifier has had adMarkers come through
    // previously
    const hasPreviousAdMarkers: { [k: string]: boolean } = {};

    // Parse the comment
    const parsedComment = parseCommentMetadata(COMM, logger);

    /**
     * 1️⃣ A note about the ridiculousness going on here...
     *
     * Oftentimes adMarkers come through the metadata stream *before* the adContext comes through,
     * and we need the offsets in these adMarkers because they aren't sent through again. Otherwise,
     * the companion ad will display long before the ad audio starts to play. SO - if our
     * tracking map already has the identifier, we return those stored values for offset
     * summed with values for offset and start from the current parsed comment
     *
     * [DEM 2024/03/04]
     */

    if (parsedComment.adMarkers) {
      // For each of the adMarkers (`parsedComment.adMarkers` is an array)...
      for (const currentAdMarkerSet of parsedComment.adMarkers) {
        // Check if we have an identifier for `currentAdMarkerSet`, and `ParsedAdMarkers` Map does
        // NOT contain that identifier...
        if (
          currentAdMarkerSet.identifier &&
          !ParsedAdMarkers.has(currentAdMarkerSet.identifier)
        ) {
          // ...then we set this `currentAdMarkerSet` in the `ParsedAdMarkers` Map
          ParsedAdMarkers.set(
            currentAdMarkerSet.identifier,
            currentAdMarkerSet as CommentAdMarkers,
          );
          // else add a flag that we have previous ad markers, to be used below
        } else if (
          currentAdMarkerSet.identifier &&
          ParsedAdMarkers.has(currentAdMarkerSet.identifier)
        ) {
          hasPreviousAdMarkers[String(currentAdMarkerSet.identifier)] = true;
        }
      }
    }

    // If we got an `adContext` from the parsed comment. (`adContext` is a base64 encoded URL that
    // points to a VAST XML document which contains information about the audio ad that will play
    // as well as any companions to display)
    if (parsedComment.adContext) {
      const inStreamAds = await getInstreamVAST(
        parsedComment.adContext,
        logger,
      );

      // Get the duration of the roundtrip for getting/parsing/returning the companion ads
      // from the VAST response, so we can subtract that duration from the delay and the time events
      // if the delay happens to be below 0
      const getCompanionVASTmeasure = performance.measure(
        VASTPerformanceMarkers.Name,
        VASTPerformanceMarkers.Start,
        VASTPerformanceMarkers.End,
      );
      const { duration: getCompanionVASTduration } = {
        ...getCompanionVASTmeasure,
      };
      performance.clearMeasures(VASTPerformanceMarkers.Name);

      // If we got any in stream ads from `getInstreamVAST`
      if (inStreamAds) {
        // Return the discrimination for companion ads for our `ProcessedMetadata` type
        return {
          type: 'companion',
          data: inStreamAds.reduce((accumulator, instreamAd) => {
            // Get the current adMarkers for this instreamAd from the parsedComment
            const currentAdMarkers = parsedComment.adMarkers?.find(
              value => String(value.identifier) === String(instreamAd.id),
            );

            // Dereference the identifier to use as the key for our `ParsedAdMarkers`,
            // default to `undefined`
            const { identifier } = currentAdMarkers ?? {
              identifier: undefined,
            };

            // Calculate the delay in an IIFE because there is scoped logic here
            const delay = (({
              ParsedAdMarkers,
              currentAdMarkers,
              identifier,
            }: {
              ParsedAdMarkers: Map<string | number, CommentAdMarkers>;
              currentAdMarkers?: Partial<CommentAdMarkers>;
              identifier?: string | number;
            }) => {
              // If `ParsedAdMarkers` has a value for the current identifier,
              // return its offset (if it exists and is greater than zero, else currentAdMakers.offset)
              // plus the currentAdMarker start
              if (identifier && currentAdMarkers) {
                const storedAdMarkers = ParsedAdMarkers.get(identifier);
                if (storedAdMarkers) {
                  const storedOffset = storedAdMarkers.offset ?? 0;

                  return (
                    // If we have an offset in the currentAdMarkers, and that offset is greater than 0
                    // then use that value, otherwise use the storedOffset
                    (currentAdMarkers.offset && currentAdMarkers.offset > 0 ?
                      currentAdMarkers.offset
                    : storedOffset) +
                    // plus the currentAdMarkers.start. `offset + start` gives us the most correct
                    // delay for displaying the companion ad. It's not always 100% correct (the
                    // audio may start up to 500ms before or after the companion displays), but
                    // currently it is the best we can do.
                    (currentAdMarkers.start ?? 0)
                  );
                  // else if `ParsedAdMarkers` does not have a value for the current identifier
                  // get the sum of `offset` and `start` for the current adMarker
                } else {
                  return (
                    (currentAdMarkers.offset ?? 0) +
                    (currentAdMarkers.start ?? 0)
                  );
                }
              } else {
                // Return zero as a base case
                return 0;
              }
            })({ ParsedAdMarkers, currentAdMarkers, identifier });

            let previousAdMarkers: CommentAdMarkers | undefined = undefined;
            let offsetTimeEvents: number | undefined = undefined;

            // If we marked this identifier as having had previous adMarkers come through in an
            // earlier comment
            if (identifier && hasPreviousAdMarkers[String(identifier)]) {
              // Then get those adMarkers as a shallow copy (which is safe as there are no nested
              // props that we care about)
              previousAdMarkers = {
                ...ParsedAdMarkers.get(identifier),
              } as CommentAdMarkers;

              // and delete the previous adMarkers from the tracking Map
              ParsedAdMarkers.delete(identifier);
            }

            // If the calculated delay, minus the time it took to download/parse the VAST response
            // is less than zero, we need to offset the time events by `getCompanionVASTduration`
            // We do a `Math.floor` here because `getCompanionVASTduration` is a
            // [DOMHighResTimeStamp](https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp)
            // and will most-likely contain microseconds in the floating point portion of the number
            // Our `delay` is milliseconds, however and we want to keep everything in integer-land.
            if (delay - Math.floor(getCompanionVASTduration) < 0) {
              offsetTimeEvents = getCompanionVASTduration;
            }
            /**
             * Return:
             * - companionAds
             * - delay
             * - identifier
             * - previousAdMarkers
             * - offsetTimeEvents
             * to the `jwplayer.on("metadataCueParsed")` handler, which in turn calls
             * `setLiveStreamCompanion`. Why not call `setLiveStreamCompanion` here? We want to
             * return control back to the jwplayer handler as soon as possible, because we are
             * `await`-ing this function there, and want to be able to handle any more metadata
             * messages that are waiting to be parsed ASAP. We don't await `setLiveStreamCompanion`,
             * as it is a "fire-and-forget" type of process, so calling that function from the
             * jwplayer handler doesn't tie up the main thread
             */

            return [
              ...accumulator,
              {
                companion: instreamAd,
                delay: Math.max(
                  0,
                  delay - Math.floor(getCompanionVASTduration ?? 0),
                ),
                identifier,
                previousAdMarkers,
                offsetTimeEvents,
              },
            ];
          }, [] as ProcessedCompanions),
        };
      }
    }
  }
}
