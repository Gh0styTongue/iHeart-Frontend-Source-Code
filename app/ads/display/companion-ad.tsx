import { CompanionAdContainer } from '@iheartradio/web.accomplice/components/display-ads';
import {
  type Companion,
  COMPANION_CLICK_THROUGH_URL_CLASS,
  ValidCompanionResourceTypes,
} from '@iheartradio/web.playback';
import { createElement, memo, useEffect, useRef } from 'react';
import { isDeepEqual, isNullish } from 'remeda';

export type CompanionAdProps = {
  companion: Companion | null;
  fullscreen?: boolean;
};

export function isImplementedCompanion(companion: Companion) {
  if (isNullish(companion)) {
    return false;
  }

  return isNullish(companion.resourceType) ? false : (
      (
        [
          ValidCompanionResourceTypes.Static,
          ValidCompanionResourceTypes.IFrame,
          ValidCompanionResourceTypes.HTML,
        ] as string[]
      ).includes(companion.resourceType)
    );
}

function CompanionAdBase({ companion, fullscreen = false }: CompanionAdProps) {
  if (isNullish(companion)) {
    return null;
  }

  const isImplemented = isImplementedCompanion(companion);

  if (!isImplemented) {
    console.group();
    console.groupCollapsed();
    console.info('Not a Static/IFrame/HTML Companion Ad');
    console.dir(companion, { depth: null });
    console.groupEnd();
  }

  return isNullish(companion.content) || !isImplemented ?
      null
    : <CompanionAdContainer
        // `dangerouslySetInnerHTML` does not parse script tags - several of our trafficked ads are
        // built by script tags, so the inner component `DangerouslySetHtmlContent` allows script
        // tags to be parsed/executed
        data-fullscreen={fullscreen}
        data-test="companion-ad-creative"
        height={companion.height}
        onClick={() => {
          if (companion.clickThroughUrl) {
            const img = document.createElement('img');
            img.className = COMPANION_CLICK_THROUGH_URL_CLASS;
            img.width = 0;
            img.height = 0;
            img.src = companion.clickThroughUrl;
            document.body.append(img);
          }
        }}
        width={companion.width}
      >
        <DangerouslySetHtmlContent allowRerender html={companion.content} />
      </CompanionAdContainer>;
}

export const CompanionAd = memo(CompanionAdBase, (previousProps, nextProps) => {
  return isDeepEqual(previousProps, nextProps);
});

/**
 * This component allows companion ad content to be written directly into an iFrame document
 *
 * @param { html, allowRerender }. The HTML to render, and whether or not to allow rerenders
 * @returns iframe
 */
function DangerouslySetHtmlContent({
  html,
  allowRerender = false,
}: {
  html: string;
  allowRerender?: boolean;
}) {
  const ifRef = useRef<HTMLIFrameElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!html || !ifRef.current) {
      throw new Error('html prop cannot be null');
    }
    if (!isFirstRender.current) {
      return;
    }
    isFirstRender.current = allowRerender;

    // Get access to the contentDocument of the iframe
    const doc = ifRef.current.contentDocument;
    if (doc) {
      // This combination of `.open()` and `.writeln()` allows for writing directly to the
      // content document while leaving the document open for more writes later. This is important
      // because some ads make use of `document.write`. If the doc is not open, those `write` calls
      // will fail
      doc.open();

      doc.writeln(html);
    }
  }, [html, ifRef, allowRerender]);

  return createElement('iframe', {
    ref: ifRef,
    src: 'about:blank',
    style: {
      border: 'none',
      width: '100%',
      height: '100%',
    },
  });
}
