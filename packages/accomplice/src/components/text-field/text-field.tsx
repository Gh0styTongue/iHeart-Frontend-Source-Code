import { mergeRefs } from '@react-aria/utils';
import {
  type ForwardedRef,
  type JSX,
  type ReactNode,
  type RefObject,
  forwardRef,
} from 'react';
import {
  type ValidationResult,
  Button as RACButton,
  Label as RACLabel,
} from 'react-aria-components';
import { isFunction } from 'remeda';
import type { Merge } from 'type-fest';

import { CancelFilled } from '../../icons/cancel-filled.js';
import { ErrorFilled } from '../../icons/error-filled.js';
import { InfoOutline } from '../../icons/info-outline.js';
import { lightDark } from '../../media.js';
import { vars } from '../../theme-contract.css.js';
import { Button } from '../button/button.js';
import { type InputProps, Input } from '../input/input.js';
import {
  hintStyles,
  labelContainerStyles,
} from '../number-field/number-field.css.js';
import { Tooltip, TooltipTrigger } from '../tooltip/tooltip.js';
import {
  clearButtonStyles,
  descriptionStyles,
  fieldErrorStyles,
  inputContainerStyles,
  inputWithButtonStyles,
  labelStyles,
  textFieldStyles,
} from './text-field.css.js';
import {
  type TextFieldProps as _TextFieldProps,
  useTextField,
  useTextFieldState,
} from './use-text-field.js';

export interface TextFieldProps extends Merge<InputProps, _TextFieldProps> {
  description?: ReactNode | string;
  errorMessage?: string | null | ((validation: ValidationResult) => string);
  hint?: string;
  icon?: JSX.Element;
  inputRef?: RefObject<HTMLInputElement | null>;
  isClearable?: boolean;
  label?: ReactNode;
  placeholder?: string;
}

function TextField(
  props: TextFieldProps,
  ref_: ForwardedRef<HTMLInputElement>,
) {
  const {
    label,
    description,
    placeholder,
    inputRef,
    icon,
    isClearable,
    hint,
    errorMessage,
    isDisabled,
    isReadOnly,
    isRequired,
    kind,
  } = props;

  const ref = mergeRefs(inputRef, ref_);
  const state = useTextFieldState(props);
  const {
    labelProps,
    descriptionProps,
    errorMessageProps,
    inputProps,
    clearButtonProps,
    ...validation
  } = useTextField(props, state, ref);

  return (
    <div
      className={textFieldStyles}
      data-disabled={isDisabled || undefined}
      data-invalid={validation.isInvalid || undefined}
      data-readonly={isReadOnly || undefined}
      data-required={isRequired || undefined}
      data-test="TextField"
    >
      <div className={labelContainerStyles}>
        <RACLabel {...labelProps} className={labelStyles}>
          {label}
        </RACLabel>
        {hint ?
          <TooltipTrigger closeDelay={100} delay={200}>
            <Button
              aria-label="Tooltip Trigger"
              color="transparent"
              css={{
                color: lightDark(
                  `${vars.color.gray600}`,
                  vars.color.brandWhite,
                ),
              }}
              data-test="number-hint-button"
              kind="tertiary"
              size="icon"
            >
              <InfoOutline size={16} />
            </Button>
            <Tooltip className={hintStyles} data-hint="true" placement="top">
              {hint}
            </Tooltip>
          </TooltipTrigger>
        : null}
      </div>
      <div className={inputContainerStyles}>
        {icon ?? null}
        <Input
          {...inputProps}
          className={inputWithButtonStyles}
          data-has-button={isClearable || undefined}
          kind={kind}
          placeholder={placeholder}
          ref={ref}
        />
        {state.value !== '' ?
          <>
            {isClearable ?
              <RACButton
                {...clearButtonProps}
                className={clearButtonStyles}
                data-test="Cancel Button"
              >
                <CancelFilled size={16} />
              </RACButton>
            : null}
          </>
        : null}
      </div>
      {errorMessage ?
        // Error message
        <div
          {...errorMessageProps}
          className={fieldErrorStyles}
          data-test="field-error"
        >
          <ErrorFilled size={{ mobile: 16, medium: 18 }} />
          {errorMessage ?
            isFunction(errorMessage) ?
              errorMessage(validation)
            : errorMessage
          : validation.validationErrors.join(' ')}
        </div>
      : description ?
        // Description
        <div
          {...descriptionProps}
          className={descriptionStyles}
          slot="description"
        >
          {description}
        </div>
      : null}
    </div>
  );
}

const _TextField = forwardRef(TextField);

export { _TextField as TextField };
