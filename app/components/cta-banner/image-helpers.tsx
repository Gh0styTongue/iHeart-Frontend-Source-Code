import { lightDark } from '@iheartradio/web.accomplice';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import type { ReactNode } from 'react';

export const StaticImage = ({ children }: { children: ReactNode }) => {
  return (
    <Flex
      aspectRatio={{ mobile: '1/1', xlarge: 'unset' }}
      borderRadius="$6"
      data-test="static-image"
      direction="row"
      flexGrow="0"
      gap="$24"
      height={{ mobile: '5.6rem', shmedium: '12.4rem' }}
    >
      {children}
    </Flex>
  );
};

export const LogoImage = ({ children }: { children: ReactNode }) => {
  return (
    <Flex
      alignItems="center"
      aspectRatio="1/1"
      backgroundColor={lightDark('$brandWhite', '$gray600')}
      borderRadius="$6"
      data-test="logo-image"
      direction="row"
      flexGrow="0"
      gap="$24"
      height={{ mobile: '5.6rem', shmedium: '12.4rem' }}
      justifyContent="center"
    >
      {children}
    </Flex>
  );
};
