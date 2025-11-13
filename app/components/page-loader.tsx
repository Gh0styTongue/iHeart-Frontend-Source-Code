import type { RainbowSprinkles } from '@iheartradio/web.accomplice';
import { lightDark, vars } from '@iheartradio/web.accomplice';
import { Box } from '@iheartradio/web.accomplice/components/box';
import { Grid } from '@iheartradio/web.accomplice/components/grid';
import { Loading } from '@iheartradio/web.accomplice/icons/loading';
import { useEffect } from 'react';

export function Loader({ css }: { css?: RainbowSprinkles }) {
  return (
    <Loading
      color={lightDark(vars.color.gray300, vars.color.brandWhite)}
      css={css}
      size={72}
    />
  );
}

export function PageLoader({ loading = false }: { loading: boolean }) {
  useEffect(() => {
    document.body.style.overflowY = loading ? 'hidden' : 'initial';
    document.body.style.touchAction = loading ? 'none' : 'initial';

    return function unmount() {
      document.body.style.overflowY = 'initial';
      document.body.style.touchAction = 'initial';
    };
  }, [loading]);

  return loading ?
      <Box
        data-test="page-loader"
        height="100vh"
        left="0"
        overflow={loading ? 'hidden' : 'auto'}
        paddingBottom={{ mobile: '5.9rem', large: '8.8rem' }}
        paddingLeft={{ mobile: 0, large: '31.6rem' }}
        paddingTop={{ mobile: '4.8rem', large: 0 }}
        pointerEvents="none"
        position="fixed"
        top="0"
        width="100vw"
        zIndex="$2"
      >
        <Grid
          height="100%"
          placeContent="center"
          position="relative"
          width="100%"
        >
          <Box
            backgroundColor={lightDark(
              vars.color.brandWhite,
              vars.color.brandBlack,
            )}
            bottom="0"
            height="100%"
            left="0"
            opacity={0.75}
            position="absolute"
            right="0"
            top="0"
            transition="background-color 200ms ease 300ms"
          />
          <Box
            height="100%"
            opacity={loading ? 1 : 0}
            transition="opacity 200ms ease 300ms"
            width="100%"
            zIndex={vars.zIndex[2]}
          >
            <Loader />
          </Box>
        </Grid>
      </Box>
    : null;
}
