import { clsx } from 'clsx/lite';
import { type ForwardedRef, forwardRef } from 'react';
import {
  type InputProps as RACInputProps,
  Input as RACInput,
} from 'react-aria-components';
import { omit, pick } from 'remeda';

import { type InputVariants, inputRecipe } from './input.css.js';

export type InputProps = RACInputProps &
  InputVariants & { isDisabled?: RACInputProps['disabled'] };

function filterVariantProps(props: InputProps) {
  return {
    variantProps: pick(props, inputRecipe.variants()),
    otherProps: omit(props, inputRecipe.variants()),
  };
}

/**
 * The `Input` component is a lower level primitive which is not often directly used in apps. It is used in combination with other primitives in components such as `TextField`, `NumberField`, `PasswordField`, etc.
 *
 * See the <a href="https://github.com/adobe/react-spectrum/blob/e1b72a79f9cc131d8ac50bb5d89ef1f42a4e01b4/packages/react-aria-components/src/Input.tsx" target="_blank">React Aria Components implementation</a> for more information.
 */
function Input(
  { className, isDisabled, ...props }: InputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { variantProps, otherProps } = filterVariantProps(props);

  return (
    <RACInput
      className={clsx(inputRecipe(variantProps), className)}
      disabled={isDisabled}
      ref={ref}
      {...otherProps}
    />
  );
}

const Input_ = forwardRef(Input);

export { Input_ as Input };
