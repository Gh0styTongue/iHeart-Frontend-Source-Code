import { clsx } from 'clsx/lite';
import type { CSSProperties, ReactNode } from 'react';
import { type AriaFieldProps, useField } from 'react-aria';
import { isFunction } from 'remeda';

import { InfoOutline } from '../../icons/info-outline.js';
import { sprinkles } from '../../sprinkles.css.js';
import { Button } from '../button/index.js';
import { Tooltip, TooltipTrigger } from '../tooltip/tooltip.js';

export interface FieldProps extends AriaFieldProps {
  children?:
    | ReactNode
    | ((fieldProps: ReturnType<typeof useField>['fieldProps']) => ReactNode);

  description?: ReactNode;
  hint?: ReactNode;
  label?: ReactNode;
  errorMessage?: ReactNode;

  style?: CSSProperties;
}

export function Field({ children, style, ...props }: FieldProps) {
  const { labelProps, fieldProps, descriptionProps, errorMessageProps } =
    useField({ ...props });

  return (
    <FieldContainer style={style}>
      {props.label || props.hint ?
        <FieldLabel {...labelProps}>
          {props.label}
          {props.hint ?
            <FieldHint>{props.hint}</FieldHint>
          : null}
        </FieldLabel>
      : null}
      {isFunction(children) ? children(fieldProps) : children}
      {props.description ?
        <FieldDescription {...descriptionProps}>
          {props.description}
        </FieldDescription>
      : null}
      {props.errorMessage ?
        <FieldErrorMessage {...errorMessageProps}>
          {props.errorMessage}
        </FieldErrorMessage>
      : null}
    </FieldContainer>
  );
}

export interface FieldContainerProps {
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}
export function FieldContainer({ className, ...props }: FieldContainerProps) {
  return (
    <div
      className={clsx(
        sprinkles({
          display: 'flex',
          flexDirection: 'column',
          width: 'full',
          gap: '4',
        }),
        className,
      )}
      {...props}
    />
  );
}

export const fieldLabelClassname = sprinkles({
  alignItems: 'center',
  display: 'flex',
  gap: '4',
  justifyContent: 'space-between',
  textKind: { mobile: 'caption-3', medium: 'caption-1' },
  width: 'full',
  color: {
    lightMode: 'gray500',
    darkMode: 'gray200',
  },
});

export interface FieldLabelProps {
  className?: string;
  children?: ReactNode;
}
export function FieldLabel({ className, ...props }: FieldLabelProps) {
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label className={clsx(fieldLabelClassname, className)} {...props} />
  );
}

export interface FieldHintProps {
  children?: ReactNode;
}
export function FieldHint({ children, ...props }: FieldHintProps) {
  return (
    <span {...props} className={sprinkles({ alignSelf: 'end' })}>
      <TooltipTrigger delay={500}>
        <Button
          color="default"
          data-test="field-hint-button"
          kind="tertiary"
          size="icon"
        >
          <InfoOutline size={16} />
        </Button>
        <Tooltip>{children}</Tooltip>
      </TooltipTrigger>
    </span>
  );
}

const baseFieldMessageClassName = sprinkles({
  textKind: { mobile: 'caption-4', medium: 'body-4' },
});

export interface FieldDescriptionProps {
  children?: ReactNode;
  className?: string;
}
export function FieldDescription({
  children,
  className,
  ...props
}: FieldDescriptionProps) {
  return (
    <div
      {...props}
      className={clsx(
        baseFieldMessageClassName,
        sprinkles({
          color: {
            lightMode: 'gray450',
            darkMode: 'gray250',
          },
        }),
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface FieldErrorMessageProps {
  children?: ReactNode;
  className?: string;
}
export function FieldErrorMessage({
  children,
  className,
  ...props
}: FieldErrorMessageProps) {
  return (
    <div
      {...props}
      className={clsx(
        baseFieldMessageClassName,
        sprinkles({
          color: {
            lightMode: 'orange650',
            darkMode: 'orange300',
          },
        }),
        className,
      )}
    >
      {children}
    </div>
  );
}
