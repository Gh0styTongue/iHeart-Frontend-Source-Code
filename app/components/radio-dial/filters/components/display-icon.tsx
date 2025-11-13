import { Globe } from '@iheartradio/web.accomplice/icons/globe';
import { Location } from '@iheartradio/web.accomplice/icons/location';

export function DisplayIcon({ id }: { id: string }) {
  return (
    id === 'use-current-location' ? <Location data-test="location" size={24} />
    : id.startsWith('country-') ? <Globe data-test="globe" size={24} />
    : null
  );
}
