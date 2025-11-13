import { clsx } from 'clsx/lite';
import type { ReactNode } from 'react';
import {
  type Key as RACKey,
  type ListBoxItemProps,
  type SelectProps,
  Button as RACButton,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectContext,
  SelectValue,
} from 'react-aria-components';
import { isFunction } from 'remeda';

import { Check } from '../../icons/check.js';
import { ChevronDown } from '../../icons/chevron-down.js';
import {
  type RainbowSprinkles,
  rainbowSprinkles,
} from '../../rainbow-sprinkles.css.js';
import { vars } from '../../theme-contract.css.js';
import { buttonRecipe } from '../button/button.css.js';
import {
  iconStyles,
  labelStyles,
  listBoxItemStyles,
  listBoxStyles,
  popoverStyles,
  selectButtonStyles,
  selectIconStyles,
  selectValueStyles,
} from './select-field.css.js';

export type { RACKey };
export { SelectContext };

export interface DefaultSelectOption {
  key: string;
  label: string;
  value: string;
}

export interface SelectFieldProps<T extends object = DefaultSelectOption>
  extends Omit<SelectProps<T>, 'children'> {
  children: ReactNode | ((item: T) => ReactNode);
  css?: RainbowSprinkles;
  items?: Iterable<T>;
  kind?: 'primary' | 'secondary' | 'tertiary';
  label?: string;
  divider?: boolean;
}

/** TODO: add optional 'hint' prop after `Field` component created
 * the designs include a hint but it's never used in current implementation [DEM 2024/12/18]
 * Field will be able to wrap Select and render an optional `label` and `hint`
 *
 * It seems that the `<Pressable>` component (which wraps the trigger of a Popover), tries to
 * forward a ref to the trigger component. In the case where that trigger is a Select Field, React
 * was complaining that the ref was invalid bc we weren't using `forwardRef` ... so I added that
 * here but am basically just doing nothing w/ it, hence the `_` [DEM 2025/01/17]
 */
export function SelectField({
  children,
  css,
  items,
  kind = 'primary',
  divider = false,
  label,
  ...props
}: SelectFieldProps) {
  const result = rainbowSprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space[4],
    width: '100%',
    ...css,
  });

  return (
    <Select className={result.className} {...props} style={result.style}>
      {label ?
        <Label className={labelStyles} data-test="select-field-label">
          {label}
        </Label>
      : null}
      <RACButton
        className={clsx(
          buttonRecipe({ kind, size: 'small' }),
          selectButtonStyles,
        )}
        data-test="select-field-button"
      >
        <SelectValue className={selectValueStyles} />
        <ChevronDown className={iconStyles} size={18} />
      </RACButton>
      <Popover
        className={popoverStyles}
        data-show-divider={divider}
        data-test="select-field-popover"
      >
        <ListBox className={listBoxStyles} items={items}>
          {children}
        </ListBox>
      </Popover>
    </Select>
  );
}

export type SelectOptionProps<T extends object = DefaultSelectOption> =
  ListBoxItemProps<T>;

export function SelectOption({ children, ...props }: SelectOptionProps) {
  return (
    <ListBoxItem className={listBoxItemStyles} {...props}>
      {renderProps => {
        if (isFunction(children)) {
          return children(renderProps);
        }

        const { isSelected } = renderProps;

        return (
          <>
            {children}
            {isSelected ?
              <Check className={selectIconStyles} size={18} />
            : null}
          </>
        );
      }}
    </ListBoxItem>
  );
}
