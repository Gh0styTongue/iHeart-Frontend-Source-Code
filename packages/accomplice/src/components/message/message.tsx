import type { ReactNode } from 'react';

import type { Theme } from '../../contexts/theme.js';
import { Check } from '../../icons/check.js';
import { CheckFilled } from '../../icons/check-filled.js';
import { ErrorFilled } from '../../icons/error-filled.js';
import { messageRecipe } from './message.css.js';

export type Kind = 'disabled' | 'error' | 'neutral' | 'success';

export interface MessageProps {
  kind?: Kind;
  hasIcon?: boolean;
  children?: ReactNode;
  colorScheme?: Theme;
}

export function Message({
  kind = 'neutral',
  hasIcon = false,
  children,
  colorScheme,
}: MessageProps) {
  return (
    <div
      className={messageRecipe({ kind })}
      data-test="message"
      style={{ colorScheme }}
    >
      {hasIcon ?
        <>
          {kind === 'error' && (
            <ErrorFilled
              data-test="message-icon"
              size={{
                xsmall: 16,
                medium: 18,
              }}
            />
          )}
          {kind === 'success' && (
            <CheckFilled
              data-test="message-icon"
              size={{
                xsmall: 16,
                medium: 18,
              }}
            />
          )}
          {(kind === 'neutral' || kind === 'disabled') && (
            <Check
              data-test="message-icon"
              size={{
                xsmall: 16,
                medium: 18,
              }}
            />
          )}
        </>
      : null}
      <>{children}</>
    </div>
  );
}
