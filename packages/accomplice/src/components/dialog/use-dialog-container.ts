import { useContext } from 'react';

import { DialogContext } from './context.js';

export interface DialogContainerValue {
  dismiss(): void;
}

export function useDialogContainer(): DialogContainerValue {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error(
      'Cannot call useDialogContainer outside a <DialogTrigger> or <DialogContainer>.',
    );
  }

  return {
    dismiss() {
      context?.onClose();
    },
  };
}
