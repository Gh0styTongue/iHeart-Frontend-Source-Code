/// <reference types="window">

export function polyfill() {
  PFurlCanParse();
  PFrequestIdleCallback();
}

// ==UserScript==
// @name         URL.canParse Polyfill
// @version      0.1.0
// @description  Polyfill for URL.canParse() in older browsers
// @author       dragonish
// @namespace    https://github.com/dragonish
// @license      GNU General Public License v3.0 or later
// @match        *://*/*
// @compatible   chrome version < 120
// @grant        none
// ==/UserScript==
function PFurlCanParse() {
  if (typeof URL.canParse !== 'function') {
    URL.canParse = function (url, base) {
      try {
        const _fullUrl = base ? new URL(url, base) : new URL(url);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    };
  }
}

function PFrequestIdleCallback() {
  /* eslint-disable no-undef */
  if (typeof window.requestIdleCallback !== 'function') {
    window.requestIdleCallback = cb => {
      const start = Date.now();
      return window.setTimeout(
        () =>
          cb({
            didTimeout: false,
            timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
          }),
        1,
      );
    };
  }

  if (typeof window.cancelIdleCallback !== 'function') {
    window.cancelIdleCallback = id => window.clearTimeout(id);
  }
  /* eslint-enable no-undef */
}
