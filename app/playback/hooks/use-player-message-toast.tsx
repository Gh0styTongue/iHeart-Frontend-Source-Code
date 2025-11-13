import { addToast } from '@iheartradio/web.accomplice/components/toast';
import { useEffect, useRef } from 'react';

import { playback } from '../playback';

export function usePlayerMessageToast() {
  const lastMessage = useRef<string | null>(null);
  const { messages } = playback.useMessage();

  useEffect(() => {
    const [message] = messages?.slice(-1) ?? [];

    if (message && lastMessage.current !== message.id) {
      lastMessage.current = message.id;

      globalThis.window?.newrelic?.noticeError?.(
        new Error(`PlayerMessage: ${message.message}`),
      );

      addToast({
        kind: message.kind ?? 'info',
        text: message.message,
      });
    }
  }, [messages]);
}
