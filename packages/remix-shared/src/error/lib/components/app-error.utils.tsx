import { Button } from '@iheartradio/web.accomplice/components/button';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import type { ReactNode } from 'react';

import type { CTAFactProps } from '../types/cta-props.js';
import { ClearCookieDialog } from './clear-cookie-dialog.js';

export const ErrorReloadButton = ({ kind, color }: CTAFactProps) => (
  <Button
    color={color}
    data-test="route-error-reload"
    kind={kind}
    onPress={() => window.location.reload()}
    size="large"
  >
    Reload
  </Button>
);

export const ErrorActionButton = ({
  color,
  kind,
  path,
  text,
}: CTAFactProps) => (
  <Button
    color={color}
    data-test="route-error-action"
    href={path}
    kind={kind}
    size="large"
  >
    {text}
  </Button>
);

export const ErrorClearButton = ({ color, kind }: CTAFactProps) => (
  <ClearCookieDialog>
    <Button
      color={color}
      data-test="route-error-clear"
      kind={kind}
      size="large"
    >
      Clear cookies
    </Button>
  </ClearCookieDialog>
);

export const ErrorCTA = ({ children }: { children: ReactNode }) => (
  <Flex data-test="route-error-cta" flexDirection="column" gap="$16">
    {children}
  </Flex>
);

export const ErrorCTAMap = {
  action: ErrorActionButton,
  reload: ErrorReloadButton,
  clear: ErrorClearButton,
} as const;
