import { Box } from '@iheartradio/web.accomplice/components/box';
import { Grid } from '@iheartradio/web.accomplice/components/grid';
import { NavigationHeader } from '@iheartradio/web.accomplice/components/navigation';
import { LogotypeSecondary } from '@iheartradio/web.accomplice/logos/logotype-secondary';
import type { ReactNode } from 'react';

import { useErrorContext } from '../hooks/error-context.js';

export const AppErrorLayout = ({ children }: { children: ReactNode }) => {
  const { fromRoot } = useErrorContext();

  if (!fromRoot) {
    return <>{children}</>;
  }

  return (
    <Grid
      gridTemplateAreas={`"nav" "content"`}
      gridTemplateColumns="1fr"
      gridTemplateRows="4.8rem auto"
    >
      <Box data-test="grid area nav" gridArea="nav">
        <NavigationHeader style={{ display: 'flex' }}>
          <LogotypeSecondary
            aria-label="iHeart Header Logotype"
            media="mobile"
            size={24}
          />
        </NavigationHeader>
      </Box>
      {children}
    </Grid>
  );
};
