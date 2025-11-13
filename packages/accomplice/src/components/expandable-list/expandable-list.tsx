import { type ReactNode, Children, forwardRef } from 'react';
import { useDisclosureState } from 'react-stately';

import { lightDark } from '../../media.js';
import { vars } from '../../theme-contract.css.js';
import { Button } from '../button/button.js';
import { Text } from '../text/text.js';
import {
  buttonContainerStyles,
  buttonStyles,
  expandableListContainerStyles,
  expandableListStyles,
} from './expandable-list.css.js';

export type ExpandableListProps = {
  children: ReactNode;
  open?: boolean;
  max: number;
  min?: number;
  onToggle?: (open: boolean) => void;
  textColor?: string;
  title?: string;
};

export const ExpandableList = forwardRef<HTMLDivElement, ExpandableListProps>(
  (
    {
      children,
      max = Number.MAX_SAFE_INTEGER,
      min = 1,
      onToggle,
      open = false,
      textColor = lightDark(vars.color.blue600, vars.color.blue200),
      title,
    },
    ref,
  ) => {
    const disclosure = useDisclosureState({ defaultExpanded: open });

    const items = Children.toArray(children).slice(
      0,
      disclosure.isExpanded ? max : min,
    );

    return (
      <div className={expandableListContainerStyles} ref={ref}>
        <Text
          as="h3"
          color={lightDark(vars.color.gray600, vars.color.brandWhite)}
          kind={{ mobile: 'h4', large: 'h3' }}
        >
          {title}
        </Text>
        <div className={expandableListStyles}>{items}</div>
        <div className={buttonContainerStyles}>
          {max > min && (
            <Button
              className={buttonStyles}
              color="default"
              inline={false}
              onPress={() => {
                disclosure.toggle();
                onToggle?.(!disclosure.isExpanded);
              }}
              textColor={textColor}
            >
              {disclosure.isExpanded ? 'Show Less' : 'Show All'}
            </Button>
          )}
        </div>
      </div>
    );
  },
);

ExpandableList.displayName = 'ExpandableList';
