import {
  Collection,
  ComboboxItem,
  Header,
  ListBoxSection,
  listBoxSectionHeaderStyles,
  listBoxSectionStyles,
} from '@iheartradio/web.accomplice/components/combobox';
import { Text } from '@iheartradio/web.accomplice/components/text';

import type { RadioDialComboboxItem } from '../filters';
import { LocationItem } from './location-item';

export function RadioDialComboboxSection({
  section,
}: {
  section: RadioDialComboboxItem;
}) {
  return (
    <ListBoxSection
      className={listBoxSectionStyles}
      data-section-divider="true"
      data-test={`radio-dial-section-${section.id}`}
      id={section.id}
    >
      {section.name ?
        <Header
          className={listBoxSectionHeaderStyles}
          data-test="radio-dial-section-header"
        >
          {section.name}
        </Header>
      : null}
      <Collection items={section.children}>
        {(child: RadioDialComboboxItem) => {
          return section.id === 'location' ?
              <ComboboxItem
                data-test={child.id}
                key={child.id}
                markSelected={child.markSelected}
                textValue={child.name}
              >
                <LocationItem item={child} />
              </ComboboxItem>
            : <ComboboxItem
                data-test={child.id}
                key={child.id}
                textValue={child.name}
              >
                <Text kind="caption-2">{child.name}</Text>
              </ComboboxItem>;
        }}
      </Collection>
    </ListBoxSection>
  );
}
