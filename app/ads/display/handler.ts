import { throttle } from '@iheartradio/web.utilities/timing';

/* 
  Below code is added to capture the ad click event
  As advert is rendering in the iframe, we can't capture the click event. `blur` event fired when element/window loses focus 
  (on iframe click or link opens in new tab/window), we are capturing that plus we are making sure that active element was advert. 
  If the clicked element is advert then we are firing click event to advert container so that we can do any action(ex: firing analytics event). 
  We are ensuring `blur` event *will* fire by focusing window with `window.focus()`. Throttle is added to prevent multiple taps/clicks.
*/
export function handler({ containerId }: { containerId?: string }) {
  return throttle(() => {
    if (document.activeElement instanceof HTMLIFrameElement) {
      const container = document.querySelector(
        'div[data-google-query-id]',
      ) as HTMLDivElement;
      if (container && container.id === containerId) {
        container.click();
      }
    }
  }, 1000);
}
