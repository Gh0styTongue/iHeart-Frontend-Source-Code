import { useControlledState } from '@react-stately/utils';
import { type ReactNode, createContext, useCallback, useContext } from 'react';
import { mergeProps } from 'react-aria';

export interface FullScreenPlayerProps {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  defaultOpen?: boolean;
}

export interface FullScreenPlayerState {
  readonly isOpen: boolean;
  setIsOpen(isOpen: boolean): void;
  open(): void;
  close(): void;
  toggle(): void;
}

export function useFullScreenPlayerState(
  props?: FullScreenPlayerProps,
): FullScreenPlayerState {
  const [isOpen, setIsOpen] = useControlledState<boolean>(
    props?.isOpen,
    props?.defaultOpen || false,
    props?.onOpenChange,
  );

  const open = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const toggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen]);

  return {
    isOpen,
    setIsOpen,
    open,
    close,
    toggle,
  };
}

export const FullScreenContext = createContext<FullScreenPlayerProps | null>(
  null,
);

export function useFullScreenPlayer(
  props?: FullScreenPlayerProps,
): FullScreenPlayerState {
  const contextProps = useContext(FullScreenContext);
  props = mergeProps(contextProps, props);
  const state = useFullScreenPlayerState(props);
  return state;
}

export function FullScreenProvider({
  children,
  ...props
}: FullScreenPlayerProps & { children: ReactNode }) {
  return (
    <FullScreenContext.Provider value={props}>
      {children}
    </FullScreenContext.Provider>
  );
}
