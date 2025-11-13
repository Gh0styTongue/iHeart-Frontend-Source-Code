import { Button } from '@iheartradio/web.accomplice/components/button';
import {
  Dialog,
  DialogTitle,
  DialogTrigger,
} from '@iheartradio/web.accomplice/components/dialog';
import { Stack } from '@iheartradio/web.accomplice/components/stack';
import { type ReactNode, useCallback, useEffect } from 'react';
import { useFetcher, useNavigation } from 'react-router';

import type { ClearCookieAction } from '../../../node/lib/clear-cookie.server.js';

type ClearCookieDialogProps = {
  children: ReactNode;
};

export const ClearCookieDialog = ({ children }: ClearCookieDialogProps) => {
  const fetcher = useFetcher<ClearCookieAction>();
  const navigation = useNavigation();
  const isSubmitting = fetcher.state === 'submitting';
  const isLoading = fetcher.state === 'loading';
  const isActionRedirect =
    fetcher.state === 'loading' &&
    fetcher.formMethod != null &&
    navigation.formMethod != 'GET' &&
    fetcher.data == null;

  const clearImageCache = useCallback(() => {
    if ('serviceWorker' in navigator) {
      // eslint-disable-next-line promise/catch-or-return
      navigator.serviceWorker.ready.then(registration => {
        // eslint-disable-next-line promise/always-return
        registration.active?.postMessage('purge');
      });
    }
  }, []);

  useEffect(() => {
    if (isActionRedirect) {
      localStorage.clear();
      sessionStorage.clear();
    }
  }, [isActionRedirect]);

  return (
    <DialogTrigger isDismissable>
      {children}
      {close => {
        return (
          <Dialog>
            <Stack gap="$16">
              <DialogTitle>Clear Cookies</DialogTitle>
              Are you sure? Clearing cookies will delete all website data and
              preferences.
              <Stack align="center" gap="$16" justify="center">
                <fetcher.Form action="/clear-cookie" method="post">
                  <Button
                    color="red"
                    isDisabled={isSubmitting || isLoading}
                    kind="primary"
                    onPress={clearImageCache}
                    size={{ mobile: 'small', medium: 'large' }}
                    type="submit"
                  >
                    Clear cookies
                  </Button>
                </fetcher.Form>
                <Button
                  color="default"
                  isDisabled={isSubmitting || isLoading}
                  kind="secondary"
                  onPress={() => close()}
                  size={{ mobile: 'small', medium: 'large' }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Dialog>
        );
      }}
    </DialogTrigger>
  );
};
