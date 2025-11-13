import { type Analytics, eventType } from '@iheartradio/web.analytics';
import deepmerge from 'deepmerge';

export type Payload = Analytics.Event & { view: Record<string, unknown> };

export async function sendIglooEvent(iglooUrl: string | URL, payload: Payload) {
  const { data, type, ...rest } = payload;

  return fetch(iglooUrl, {
    method: 'POST',
    body: JSON.stringify({
      action: type,
      ...deepmerge.all([data ?? {}, rest ?? {}]),
      ...(type === eventType.enum.PageView ?
        {
          view: { ...deepmerge.all([data?.view ?? {}, rest?.view ?? {}]) },
        }
      : {}),
    }),
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
