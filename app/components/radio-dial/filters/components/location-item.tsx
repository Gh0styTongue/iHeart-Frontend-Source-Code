import { Flex } from '@iheartradio/web.accomplice/components/flex';
import { Text } from '@iheartradio/web.accomplice/components/text';

import type { RadioDialComboboxItem } from '../filters';
import { DisplayIcon } from './display-icon';

export function LocationItem({ item }: { item: RadioDialComboboxItem }) {
  return (
    <Flex
      alignItems="center"
      data-test="radio-dial-location-item"
      direction="row"
      gap="$8"
      justifyContent="flex-start"
    >
      <DisplayIcon id={String(item.id)} />
      <Flex direction="column">
        <Text data-test="radio-dial-location-item-title" kind="body-3">
          {String(item.id).startsWith('country-') ?
            'Change Country'
          : 'Use Current Location'}
        </Text>
        <Text color="$gray400" kind="caption-2">
          {item.name}
        </Text>
      </Flex>
    </Flex>
  );
}
