import { useControlledState } from '@react-stately/utils';
import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  RefObject,
} from 'react';
import type { AriaButtonProps, AriaSearchFieldProps } from 'react-aria';
import { useTextField as _useTextField } from 'react-aria';
import type { ValidationResult } from 'react-aria-components';

import type { DOMAttributes } from '../../types.js';

export interface TextFieldAria extends ValidationResult {
  /** Props for the text field's visible label element (if any). */
  labelProps: LabelHTMLAttributes<HTMLLabelElement>;
  /** Props for the input element. */
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  /** Props for the clear button. */
  clearButtonProps: AriaButtonProps;
  /** Props for the searchfield's description element, if any. */
  descriptionProps: DOMAttributes;
  /** Props for the searchfield's error message element, if any. */
  errorMessageProps: DOMAttributes;
}

export type TextFieldProps = AriaSearchFieldProps;

function toString(val: unknown) {
  if (val == null) {
    return;
  }

  return val.toString();
}

/**
 * This hook extends the default behavior of React Aria's `useTextField()` with some of the
 * functionality from another hook of theirs: `useSearchField()`.
 *
 * According to the design spec, our Text Field needs to have a clear button which is not part of
 * React Aria's `useTextField()` but is part of `useSearchField()`. So, we need to support that
 * behavior somehow and this seemed like the least hacky way.
 *
 * This implementation is very much based on their `useSearchField()`, minus a few things. It serves
 * as a good reference: https://github.com/adobe/react-spectrum/blob/93c26d8bd2dfe48a815f08c58925a977b94d6fdd/packages/%40react-aria/searchfield/src/useSearchField.ts
 */
export function useTextField(
  props: TextFieldProps,
  state: TextFieldState,
  inputRef: RefObject<HTMLInputElement>,
): TextFieldAria {
  const { isDisabled, isReadOnly, onClear, type = 'input', onKeyDown } = props;

  const onClearButtonClick = () => {
    state.setValue('');

    if (onClear) {
      onClear();
    }
  };

  const onPressStart = () => {
    // this is in PressStart for mobile so that touching the clear button doesn't remove focus from
    // the input and close the keyboard
    inputRef?.current?.focus();
  };

  const {
    labelProps,
    inputProps,
    descriptionProps,
    errorMessageProps,
    ...validation
  } = _useTextField<'input'>(
    {
      ...props,
      value: state.value,
      onChange: state.setValue,
      onKeyDown,
      type,
    },
    inputRef,
  );

  return {
    labelProps,
    inputProps,
    clearButtonProps: {
      // TODO: Add translation support for this
      'aria-label': 'Clear input',
      excludeFromTabOrder: true,
      preventFocusOnPress: true,
      isDisabled: isDisabled || isReadOnly,
      onPress: onClearButtonClick,
      onPressStart,
    },
    descriptionProps,
    errorMessageProps,
    ...validation,
  };
}

export interface TextFieldState {
  readonly value: string;

  setValue(value: string): void;
}

export function useTextFieldState(props: TextFieldProps): TextFieldState {
  const [value, setValue] = useControlledState(
    toString(props.value),
    toString(props.defaultValue) || '',
    props.onChange,
  );

  return {
    value,
    setValue,
  };
}
