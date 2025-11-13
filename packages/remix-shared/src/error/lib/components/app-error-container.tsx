import { lightDark, vars } from '@iheartradio/web.accomplice';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import type { ReactNode } from 'react';

export const AppErrorContainer = ({ children }: { children: ReactNode }) => {
  return (
    <Flex
      backgroundColor={lightDark(vars.color.gray100, vars.color.brandBlack)}
      data-test="page-error-container"
      flexGrow="1"
      justifyContent="center"
    >
      {children}
    </Flex>
  );
};
