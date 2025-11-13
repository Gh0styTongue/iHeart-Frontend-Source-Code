import {
  type Emitter,
  createEmitter,
} from '@iheartradio/web.utilities/create-emitter';

export type ImageEmitterProps = {
  set: (
    property: PropertyKey,
    value: any,
  ) => { property: PropertyKey; value: any };
};

export const ImageEmitter: Emitter<ImageEmitterProps> =
  createEmitter<ImageEmitterProps>({
    set(property: PropertyKey, value: any) {
      return { property, value };
    },
  });

/**
 * `window.COMSCORE.beacon` ultimately constructs an Image, and sets the `src` to be the value
 *  of the tracking call. In order to fire the Pageview Candidate call AFTER the tracking call
 *  (which is what I'm assuming needs to happen from studying the documentation)... we need to
 *  be able to trap both the `Image` constructor, and any `set` calls that occur on properties
 *  returned from the constructor (e.g., `img.src = something;`);
 *
 *  @returns void
 */
export function proxyImage() {
  if (!window) {
    return;
  }

  const { Image } = window;

  const ProxyImage = new Proxy(Image, {
    // We need to be able to trap `src` assignments, so we have to proxy the constructor
    // With a Proxy wrapper of its own
    construct(ctorTarget, ctorArgs, newTarget) {
      // Create the handler for the Proxy returned from the constructor
      const handler = {
        set(
          target: HTMLImageElement,
          property: keyof HTMLImageElement,
          value: any,
        ) {
          // Call `ImageEmitter.set`, so that the subscriptions set in the comscore tracker
          // will fire
          ImageEmitter.set(property, value);
          // Finally, use `Reflect.set` to send the value to the underlying `Image`
          return Reflect.set(target, property, value);
        },
        // In cases where the property accessor is a function, we must bind the target's `this`
        get(target: HTMLImageElement, property: keyof HTMLImageElement) {
          if (typeof target[property] === 'function') {
            return target[property].bind(target);
          }
          return target[property];
        },
      };
      // Return a Proxy from the constructor, using `Reflect.construct` to construct the
      // the `Image` behind
      return new Proxy(
        Reflect.construct(ctorTarget, ctorArgs, newTarget),
        handler,
      );
    },
  });
  // Finally "overwrite" `window.Image` with our new `ProxyImage`
  Reflect.set(window, 'Image', ProxyImage);
}
