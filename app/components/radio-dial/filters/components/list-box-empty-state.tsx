import { Text } from '@iheartradio/web.accomplice/components/text';
import { isNumber } from 'remeda';

import { useRadioDialFilterState } from '../state/use-filter-state';

export function ListBoxEmptyState({ inputValue }: { inputValue: string }) {
  const maybeZip = isNumber(Number(inputValue));

  const [filterState] = useRadioDialFilterState();

  const text =
    maybeZip ?
      filterState.invalidZip ?
        'Please enter a valid ZIP code'
      : 'Continue Entering ZIP code'
    : 'No results found. Please try again';

  return (
    <Text
      as="p"
      css={{ textAlign: 'center', padding: '$8' }}
      data-test="radio-dial-listbox-empty-text"
      kind={{ mobile: 'subtitle-4', medium: 'subtitle-4' }}
    >
      {text}
    </Text>
  );
}
