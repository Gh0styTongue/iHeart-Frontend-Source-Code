import { Button } from '@iheartradio/web.accomplice/components/button';
import { CTABanner } from '@iheartradio/web.accomplice/components/cta-banner';

import type { RegGateContext } from '~app/analytics/data';
import { useLoginUrl, useSignUpUrl } from '~app/hooks/auth-urls';
import { useGetPageName } from '~app/hooks/use-get-page-name';
import {
  ANALYTICS_ORIGIN,
  PAYLOAD_TRIGGER_TYPES,
} from '~app/utilities/constants';

import type { CardCarouselProps } from '../card-carousel/card-carousel';
import { CarouselPlaceHolder } from '../cta-banner/cta-banner';
import { LogoImage } from '../cta-banner/image-helpers';
import type { RecentlyPlayedMappingData } from './mapping';

export const EmptyStateAuth = ({
  carouselSlideGap,
  description,
  editable = false,
  logo,
  onPress,
  title,
  titleSlug,
}: Omit<Omit<RecentlyPlayedMappingData, 'stationTypes'>, 'button'> & {
  onPress: () => void;
  carouselSlideGap: CardCarouselProps['slideGap'];
}) => {
  return (
    <CTABanner
      buttons={
        <Button
          color="red"
          data-test="empty-state-auth-search"
          kind="primary"
          {...{ onPress }}
          rel="nofollow"
          size="small"
        >
          Search
        </Button>
      }
      carouselKind={titleSlug}
      data-test="empty-state-auth-search"
      description={description}
      EmptyState={
        <CarouselPlaceHolder
          carouselKind="recently-played"
          carouselSlideGap={carouselSlideGap}
          editable={editable}
        />
      }
      images={<LogoImage>{logo}</LogoImage>}
      title={title}
    />
  );
};

export const EmptyStateUnauth = ({
  carouselSlideGap,
  description,
  editable = false,
  onPress,
  title,
  titleSlug,
}: Omit<Omit<RecentlyPlayedMappingData, 'stationTypes'>, 'button'> & {
  onPress?: () => void;
  carouselSlideGap: CardCarouselProps['slideGap'];
}) => {
  const pageName = useGetPageName();

  const regGateContext = {
    trigger: PAYLOAD_TRIGGER_TYPES.RECENTLY_PLAYED,
    origin: ANALYTICS_ORIGIN.LISTEN,
    pageName,
    location: 'reg_button',
  } satisfies RegGateContext;

  const loginUrl = useLoginUrl({ context: regGateContext });
  const signUpUrl = useSignUpUrl({ context: regGateContext });

  return (
    <CTABanner
      buttons={
        <>
          <Button
            color="red"
            data-test="empty-state-unauth-login"
            href={loginUrl.toString()}
            kind="primary"
            onPress={onPress}
            rel="nofollow"
            size="small"
          >
            Log in
          </Button>
          <Button
            color="default"
            data-test="empty-state-unauth-signup"
            href={signUpUrl.toString()}
            kind="secondary"
            onPress={onPress}
            rel="nofollow"
            size="small"
          >
            Sign up
          </Button>
        </>
      }
      carouselKind={titleSlug}
      description={description}
      EmptyState={
        <CarouselPlaceHolder
          carouselKind="recently-played"
          carouselSlideGap={carouselSlideGap}
          editable={editable}
        />
      }
      title={title}
    />
  );
};
