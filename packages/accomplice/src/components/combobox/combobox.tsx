import { clsx } from 'clsx/lite';
import {
  type ReactElement,
  type ReactNode,
  cloneElement,
  useCallback,
  useLayoutEffect,
  useRef,
} from 'react';
import { mergeProps, useFocus } from 'react-aria';
import type {
  ComboBoxProps,
  Key,
  ListBoxItemProps,
  ListBoxProps,
  ListBoxSectionProps,
  PopoverProps,
} from 'react-aria-components';
import {
  Button as RACButton,
  ComboBox as RACCombobox,
  Input as RACInput,
  Label as RACLabel,
  ListBox as RACListBox,
  ListBoxItem as RACListBoxItem,
  ListBoxSection as RACListBoxSection,
  Popover as RACPopover,
} from 'react-aria-components';
import { isFunction, isNonNullish, isString } from 'remeda';

import type { RainbowSprinkles } from '#src/rainbow-sprinkles.css.js';
import { rainbowSprinkles } from '#src/rainbow-sprinkles.css.js';

import { Check } from '../../icons/check.js';
import { vars } from '../../theme-contract.css.js';
import { baseButtonStyles, buttonRecipe } from '../button/button.css.js';
import type { IconProps } from '../icon/icon.js';
import { Text } from '../text/text.js';
import {
  buttonStyles,
  comboBoxInputStyles,
  inputGroupStyles,
  listBoxItemStyles,
  listBoxSectionStyles,
  popoverStyles,
  selectIconStyles,
} from './combobox.css.js';

export type ComboboxItem = {
  id: number | string;
  name?: string;
  children?: ComboboxItem[];
};

export interface ComboboxProps<T extends object = ComboboxItem>
  extends Omit<ComboBoxProps<T>, 'children'> {
  autoSelectText?: boolean;
  label?: string | ReactNode;
  css?: RainbowSprinkles;
  children: ReactNode | ((item: T) => ReactNode);
  inputIcon?: {
    icon: ReactElement<IconProps>;
    props: Omit<IconProps, 'children'>;
  };
  isOpen?: PopoverProps['isOpen'];
  placeholder?: string;
  inputSize?: number;
  divider?: boolean;
  popoverProps?: {
    maxHeight?: number;
  };
  renderEmptyState?: ListBoxProps<T>['renderEmptyState'];
  kind?: 'primary' | 'secondary' | 'tertiary';
  hideLabel?: boolean;
}

export const Combobox = (props: ComboboxProps<ComboboxItem>) => {
  const {
    autoSelectText,
    kind = 'primary',
    isOpen,
    hideLabel,
    children,
    css,
    label,
    divider = false,
    inputIcon,
    items,
    inputSize = 20,
    popoverProps = { maxHeight: 200 },
    renderEmptyState: _renderEmptyState,
    ...restProps
  } = props;

  const renderEmptyState =
    _renderEmptyState ??
    (() => (
      <Text
        as="p"
        css={{ textAlign: 'center', padding: vars.space[8] }}
        kind={{ mobile: 'subtitle-4', medium: 'subtitle-4' }}
      >
        No results found. Please try again.
      </Text>
    ));

  const result = rainbowSprinkles({
    position: 'relative',
    ...css,
  });

  // These local handlers and ref (along with mergeProps down below 👇🏻) make it to where when
  // the user clicks on a combobox, the text is selected so that they can begin typing immediately
  // without having to manually clear the box first.
  //
  // Also, when a selection is made, the input will blur so that the cursor doesn't stay
  // active in the text box.
  //
  // [DEM 2025/02/07]
  const inputRef = useRef<HTMLInputElement>(null);

  const onSelectionChange = useCallback((selectedKey: Key) => {
    // When the input field is cleared, this method gets called with `null`
    // We don't want to close the popover when there is no selected key, so we check for truthiness
    // Before calling `blur` on the input
    if (selectedKey) {
      inputRef.current?.blur();
    }
  }, []);

  const onOpenChange = useCallback(
    (isOpen: boolean) => {
      if (isOpen && autoSelectText) {
        inputRef.current?.select();
      }
    },
    [autoSelectText],
  );

  const InputIcon =
    inputIcon?.icon ?
      cloneElement<IconProps>(inputIcon.icon, {
        ...inputIcon.props,
      })
    : <></>;

  const hasIcon = isNonNullish(inputIcon);

  const { focusProps } = useFocus({
    onFocus: () => {
      const root = (document.scrollingElement ||
        document.documentElement) as HTMLElement;
      // eslint-disable-next-line react-compiler/react-compiler
      root.style.overflow = 'hidden';
    },
    onBlur: () => {
      const root = (document.scrollingElement ||
        document.documentElement) as HTMLElement;
      root.style.overflow = 'auto';
    },
  });

  // Setting the input size this way prevents a SSR Hydration Mismatch error
  useLayoutEffect(() => {
    inputRef.current?.setAttribute('size', String(inputSize));
  }, [inputSize]);

  return (
    <RACCombobox
      allowsEmptyCollection={true}
      className={result.className}
      menuTrigger="focus"
      style={result.style}
      // This merges the local handlers with any that were passed in via props
      {...mergeProps(
        restProps,
        { onSelectionChange, onOpenChange },
        result.otherProps,
      )}
    >
      <RACLabel {...(hideLabel ? { style: { display: 'none' } } : null)}>
        {label}
      </RACLabel>
      {/* Do not remove - This Button comes from React Aria, it is not visible in the UI, but rendering it is required for full Combobox functionality */}
      <div className={clsx(baseButtonStyles, inputGroupStyles)}>
        <RACButton
          className={clsx(buttonRecipe({ kind, size: 'small' }), buttonStyles)}
        />
        {InputIcon}
        <RACInput
          autoFocus={false}
          className={comboBoxInputStyles}
          data-has-icon={hasIcon}
          data-react-aria-prevent-focus="true"
          data-test="combobox-input"
          ref={inputRef}
          type="text"
          {...focusProps}
        />
      </div>
      <RACPopover
        className={popoverStyles}
        crossOffset={inputIcon ? Number(inputIcon.props.size) * 2 * -1 : 0}
        data-show-divider={divider}
        data-test="combobox-popover"
        isOpen={isOpen}
        maxHeight={popoverProps.maxHeight}
        offset={12}
      >
        <RACListBox
          data-test="combobox-list"
          items={items}
          renderEmptyState={renderEmptyState}
        >
          {children}
        </RACListBox>
      </RACPopover>
    </RACCombobox>
  );
};

export function ListBoxItem({
  children,
  markSelected = false,
  ...props
}: ListBoxItemProps & { markSelected?: boolean }) {
  const textValue = isString(children) ? children : undefined;

  return (
    <RACListBoxItem
      className={listBoxItemStyles}
      textValue={textValue}
      {...props}
    >
      {renderProps => {
        if (isFunction(children)) {
          return children(renderProps);
        }

        const { isSelected } = renderProps;

        return (
          <>
            {children}
            {isSelected || markSelected ?
              <Check className={selectIconStyles} size={18} />
            : null}
          </>
        );
      }}
    </RACListBoxItem>
  );
}

export function ListBoxSection({
  withDivider = false,
  section,
  ...props
}: ListBoxSectionProps<ComboboxItem> & {
  withDivider?: boolean;
  section: ComboboxItem;
}) {
  return (
    <RACListBoxSection
      className={listBoxSectionStyles}
      data-section-divider={withDivider}
      {...props}
    >
      {section.children?.map(item => {
        return (
          <ListBoxItem key={item.id} textValue={item.name}>
            {item.name}
          </ListBoxItem>
        );
      })}
    </RACListBoxSection>
  );
}
