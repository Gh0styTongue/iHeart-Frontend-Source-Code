import { Box } from '@iheartradio/web.accomplice/components/box';
import { ExpandableList } from '@iheartradio/web.accomplice/components/expandable-list';
import { useRef } from 'react';
import { useLoaderData } from 'react-router';

import { trackClick } from '~app/analytics/track-click';
import { TrendingCard } from '~app/components/trending-card';
import { useConfig } from '~app/contexts/config';
import { useQueryTrendingData } from '~app/queries/trending-data';

import type { HomeServerLoader } from '../.server/loader';

const title = 'Trending on iHeart';

export function TrendingSection() {
  const config = useConfig();
  const { pageName } = useLoaderData<HomeServerLoader>();
  const ref = useRef<HTMLDivElement>(null);

  const { data } = useQueryTrendingData({
    country: config.environment.countryCode,
    locale: config.environment.locale,
  });

  if (data === undefined || data.length === 0) {
    return null;
  }

  return (
    <Box padding={{ mobile: '$16', large: '$32' }}>
      <ExpandableList
        max={data.length}
        min={4}
        onToggle={open => {
          trackClick({
            pageName,
            sectionName: 'trending_on_iheart',
            location: 'show_all_button',
          });

          if (open || !ref.current) {
            return;
          }

          // The 64 accounts for the header height.
          window.scrollTo({ top: ref.current.offsetTop - 64 });
        }}
        ref={ref}
        title={title}
      >
        {data.map((item, i) => {
          const { link, target } = formatLink(item.link);

          return (
            <TrendingCard
              href={link}
              image={item.image}
              index={i}
              key={i}
              pageName={pageName}
              rank={i + 1}
              target={target}
              title={item.title}
            />
          );
        })}
      </ExpandableList>
    </Box>
  );
}

function formatLink(href: string): {
  link: string;
  target: '_blank' | '_self';
} {
  const domain = 'www.iheart.com';
  const index = href.indexOf(domain);
  // doing this because spotlight links come back to us as `/spotlight/<ID>` and do not include domain
  const isSpotlight = href.includes('/spotlight');

  if (index > -1 || isSpotlight) {
    const slice = !isSpotlight ? href.slice(index + domain.length) : href;

    if (
      slice.startsWith('/artist') ||
      slice.startsWith('/browse') ||
      slice.startsWith('/live') ||
      slice.startsWith('/playlist') ||
      slice.startsWith('/podcast') ||
      slice.startsWith('/search') ||
      slice.startsWith('/spotlight')
    ) {
      return { link: slice, target: '_self' };
    }

    return { link: href, target: '_blank' };
  }

  return { link: href, target: '_blank' };
}
