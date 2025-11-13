import { Flex } from '@iheartradio/web.accomplice/components/flex';
import type { ReactNode } from 'react';

export const AppErrorItem = ({ children }: { children: ReactNode }) => {
  return (
    <Flex
      asChild
      data-test="page-error-item"
      flexDirection="column"
      gridArea="content"
      maxWidth="42rem"
      overflowX="hidden"
      overflowY="auto"
    >
      <main>
        <Flex flexGrow={1} width="100%">
          <Flex height="fit-content" minHeight="100%" width="inherit">
            {children}
          </Flex>
        </Flex>
      </main>
    </Flex>
  );
};
