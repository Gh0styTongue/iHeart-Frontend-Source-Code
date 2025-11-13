import type { HTMLAttributes } from 'react';
import { createContext } from 'react';

export interface DialogContextValue extends HTMLAttributes<HTMLElement> {
  // TODO: We should support this kind of thing eventually
  // type: 'modal' | 'popover' | 'tray' | 'fullscreen' | 'fullscreenTakeover';
  isDismissable?: boolean;
  onClose: () => void;
}

export const DialogContext = createContext<DialogContextValue | null>(null);
