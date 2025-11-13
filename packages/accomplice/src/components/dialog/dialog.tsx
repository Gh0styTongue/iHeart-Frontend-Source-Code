import { PressResponder } from '@react-aria/interactions';
import { clsx } from 'clsx/lite';
import {
  type ComponentProps,
  type ForwardedRef,
  type ReactElement,
  type ReactNode,
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useOverlayTrigger } from 'react-aria';
import {
  type ButtonProps as RACButtonProps,
  type DialogProps as RACDialogProps,
  type ModalOverlayProps,
  Button as RACButton,
  Dialog as RACDialog,
  Heading as RACHeading,
  Modal,
  ModalContext,
  ModalOverlay,
  OverlayTriggerStateContext,
} from 'react-aria-components';
import {
  type OverlayTriggerProps,
  useOverlayTriggerState,
} from 'react-stately';
import { isFunction } from 'remeda';

import { Cancel } from '../../icons/cancel.js';
import { buttonRecipe } from '../button/button.css.js';
import { DialogContext } from './context.js';
import {
  closeButtonStyles,
  dialogHeadingStyles,
  dialogStyles,
  modalStyles,
  underlayStyles,
} from './dialog.css.js';

export interface DialogModalProps extends ModalOverlayProps {}
export function DialogModal({ children, ...props }: DialogModalProps) {
  const showCloseButton = props.isDismissable;

  return (
    <ModalContext.Provider value={props}>
      <ModalOverlay className={underlayStyles}>
        <Modal
          className={modalStyles}
          data-has-close-button={showCloseButton || undefined}
        >
          {renderProps => {
            return (
              <>
                {showCloseButton ?
                  <CloseButton />
                : null}
                {isFunction(children) ? children(renderProps) : children}
              </>
            );
          }}
        </Modal>
      </ModalOverlay>
    </ModalContext.Provider>
  );
}

export type DialogClose = ReactElement | ((close: () => void) => ReactElement);

interface DialogTriggerProps extends OverlayTriggerProps {
  children: [ReactElement | ReactNode, DialogClose | ReactElement];
  isDismissable?: boolean;
  isOpen?: boolean;
}

export function DialogTrigger({ children, ...props }: DialogTriggerProps) {
  if (!Array.isArray(children) || children.length > 2) {
    throw new Error('DialogTrigger must have exactly 2 children');
  }

  const buttonRef = useRef(null);

  // if a function is passed as the second child, it won't appear in toArray
  const [trigger, content] = children as [ReactElement, DialogClose];
  const state = useOverlayTriggerState(props);

  const { triggerProps, overlayProps } = useOverlayTrigger(
    { type: 'dialog' },
    state,
    buttonRef,
  );

  const id = useId();

  return (
    <>
      {trigger ?
        <PressResponder
          {...triggerProps}
          isPressed={state.isOpen}
          ref={buttonRef}
        >
          {trigger}
        </PressResponder>
      : <RACButton {...triggerProps} id={id}>
          Open Dialog
        </RACButton>
      }
      {state.isOpen ?
        <DialogModal
          {...props}
          isOpen={state.isOpen}
          onOpenChange={state.setOpen}
        >
          {cloneElement(isFunction(content) ? content(state.close) : content, {
            ...overlayProps,
            // @ts-expect-error It's not supported by the types but this should improve accessibility
            'aria-labelledby': id,
          })}
        </DialogModal>
      : null}
    </>
  );
}

export interface DialogProps extends RACDialogProps {
  title?: string;
  className?: string;
}
export const Dialog = forwardRef(function Dialog(
  { title, children, ...props }: DialogProps,
  ref: ForwardedRef<HTMLElement>,
) {
  return (
    <>
      <RACDialog
        {...props}
        className={props.className ?? dialogStyles}
        ref={ref}
      >
        {renderProps => {
          return (
            <>
              {title ?
                <DialogTitle>{title}</DialogTitle>
              : null}
              {isFunction(children) ? children(renderProps) : children}
            </>
          );
        }}
      </RACDialog>
    </>
  );
});

type CloseButtonProps = RACButtonProps;
function CloseButton({ className, ...props }: CloseButtonProps) {
  const classNames = clsx(
    className,
    buttonRecipe({ color: 'white', kind: 'tertiary', size: 'icon' }),
    closeButtonStyles,
  );

  const state = useContext(OverlayTriggerStateContext)!;

  return (
    <RACButton
      className={classNames}
      onPress={() => {
        state.close();
      }}
      {...props}
    >
      <Cancel size={24} />
    </RACButton>
  );
}

export function DialogTitle({
  className,
  ...props
}: ComponentProps<typeof RACHeading>) {
  return (
    <RACHeading
      {...props}
      className={clsx(dialogHeadingStyles, className)}
      slot="title"
    />
  );
}

export interface DialogContainerProps {
  /** The Dialog to display, if any. */
  children: ReactNode;
  /** Handler that is called when the 'x' button of a dismissable Dialog is clicked. */
  onDismiss: () => void;
  /** Whether the Dialog is dismissable. See the [Dialog docs](Dialog.html#dismissable-dialogs) for more details. */
  isDismissable?: boolean;
  /** Whether pressing the escape key to close the dialog should be disabled. */
  isKeyboardDismissDisabled?: boolean;
}

export function DialogContainer(props: DialogContainerProps) {
  const { children, onDismiss, isDismissable, isKeyboardDismissDisabled } =
    props;

  const childArray = Children.toArray(children);
  if (childArray.length > 1) {
    throw new Error('Only a single child can be passed to DialogContainer.');
  }

  const [lastChild, setLastChild] = useState<ReactElement | null>(null);

  // React.Children.toArray mutates the children, and we need them to be stable
  // between renders so that the lastChild comparison works.
  let child: ReactElement | undefined = undefined;
  if (Array.isArray(children)) {
    child = children.find(isValidElement);
  } else if (isValidElement(children)) {
    child = children;
  }

  if (child && child !== lastChild) {
    setLastChild(child);
  }

  const dialogContext = useMemo(
    () => ({
      onClose: onDismiss,
      isDismissable,
    }),
    [isDismissable, onDismiss],
  );

  const state = useOverlayTriggerState({
    isOpen: !!child,
    onOpenChange: isOpen => {
      if (!isOpen) {
        onDismiss();
      }
    },
  });

  const modalContext = useMemo(
    () => ({
      isOpen: state.isOpen,
      onOpenChange: state.setOpen,
      isDismissable,
      isKeyboardDismissDisabled,
    }),
    [isDismissable, isKeyboardDismissDisabled, state.isOpen, state.setOpen],
  );

  return (
    <DialogModal {...modalContext}>
      <DialogContext.Provider value={dialogContext}>
        {lastChild}
      </DialogContext.Provider>
    </DialogModal>
  );
}
