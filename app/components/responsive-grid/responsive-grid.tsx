import type { GridProps } from '@iheartradio/web.accomplice/components/grid';
import { Grid } from '@iheartradio/web.accomplice/components/grid';
import { createContext, useContext } from 'react';

import { useIsMobile } from '~app/contexts/is-mobile';

const ResponsiveGridContext = createContext(5);
export const useResponsiveGridContext = () => {
  const initialSlides = useContext(ResponsiveGridContext);
  return [initialSlides];
};

type GridKind = 'content' | 'genre' | 'feature';

export type ResponsiveGridProps = Omit<GridProps, 'gap, templateColumns'> & {
  kind: GridKind;
  showAdvert?: boolean;
};

const mobileMaxColumnCount: Record<GridKind, number> = {
  content: 8,
  genre: 6,
  feature: 1,
} as const;

const desktopMaxColumnCount: Record<GridKind, number> = {
  content: 8,
  genre: 7,
  feature: 4,
} as const;

const featureColumnCount: Record<
  'mobile' | 'small' | 'large' | 'xlarge',
  number
> = {
  mobile: 1,
  small: 2,
  large: 3,
  xlarge: 4,
};

const minWidth = '11.9rem';

export const ResponsiveGrid = ({
  children,
  kind,
  showAdvert,
  ...props
}: ResponsiveGridProps) => {
  const isMobile = useIsMobile();
  const initialSlides =
    isMobile ? mobileMaxColumnCount[kind] : desktopMaxColumnCount[kind];

  return (
    <ResponsiveGridContext.Provider value={initialSlides}>
      <Grid
        data-test="responsive-grid"
        gap="$16"
        gridTemplateColumns={
          kind === 'feature' ?
            {
              mobile: `repeat(${featureColumnCount.mobile}, 1fr)`,
              small: `repeat(${featureColumnCount.small}, 1fr)`,
              large: `repeat(${featureColumnCount.large}, 1fr)`,
              xlarge: `repeat(${featureColumnCount.xlarge}, 1fr)`,
            }
          : {
              mobile: `repeat(auto-fill, minmax(max(${minWidth}, calc((100% - 1.6rem) / ${mobileMaxColumnCount[kind]})), 1fr))`,
              xlarge: `repeat(auto-fill, minmax(max(${minWidth}, calc((100% - 1.6rem) / ${desktopMaxColumnCount[kind]})), 1fr))`,
            }
        }
        {...(kind !== 'feature' && showAdvert ?
          {
            gridTemplateRows: {
              // This is inline advert sizes packages/accomplice/src/components/display-ads/inline-ad.css.ts
              mobile: '1fr 8.2rem',
              medium: '1fr 15.4rem',
            },
          }
        : {})}
        {...props}
      >
        {children}
      </Grid>
    </ResponsiveGridContext.Provider>
  );
};
