import { vars } from '@iheartradio/web.accomplice';
import { Box } from '@iheartradio/web.accomplice/components/box';
import { Button } from '@iheartradio/web.accomplice/components/button';
import { Text } from '@iheartradio/web.accomplice/components/text';
import { eventType as EventType } from '@iheartradio/web.analytics';
import { MediaServerURL } from '@iheartradio/web.assets';
import { isEmpty, isNullish, toSnakeCase } from 'remeda';

import { analytics } from '~app/analytics/create-analytics';
import { useGetPageName } from '~app/hooks/use-get-page-name';
import { useQueryMarketingBanner } from '~app/queries/marketing-banner';

const BANNER_HEIGHTS = {
  mobile: '21.6rem',
  large: '26rem',
};

const getMarketingBannerMediaServerURL = (url: string) => {
  if (!url) return '';
  return MediaServerURL.fromURL(url)
    .setCacheable(false) // same as legacy
    .toURL()
    .toString();
};

export const MarketingBanner = () => {
  const pageName = useGetPageName();
  const { data: bannerData } = useQueryMarketingBanner({});

  if (isNullish(bannerData) || isEmpty(bannerData)) {
    return null;
  }

  const title = bannerData.title?.value ?? '';
  const description = bannerData.description?.value ?? '';

  const bgImageMeta = {
    mobile: {
      src: getMarketingBannerMediaServerURL(
        bannerData.small_image?.value?.public_uri ?? '',
      ),
      type: 'marketing-banner-small-bg',
    },
    large: {
      src: getMarketingBannerMediaServerURL(
        bannerData.large_image?.value?.public_uri ?? '',
      ),
      type: 'marketing-banner-large-bg',
    },
  };

  const ctaUrl = bannerData.link?.value ?? '';
  const ctaText = bannerData.link_text?.value ?? '';

  return (
    <Box
      data-test="marketing-container"
      display="flex"
      overflow="hidden"
      width="100%"
    >
      <Box
        data-test="marketing-wrapper"
        height={BANNER_HEIGHTS}
        position="relative"
        width="100%"
      >
        <Box
          backgroundColor={bannerData.background_color?.value}
          data-test="marketing-image"
          height={BANNER_HEIGHTS}
          overflow="hidden"
          transition="background-color"
          width="100%"
        >
          <Box height="100%" width="100%">
            <Box
              animation="fades-in 1s"
              height={BANNER_HEIGHTS}
              maxWidth="none"
              minHeight={{
                mobile: '0',
              }}
              opacity="1"
              position="absolute"
              transition="opacity 300ms"
              width="100%"
            >
              <Box
                alignItems="flex-end"
                display="flex"
                height="100%"
                justifyContent="flex-end"
              >
                {bgImageMeta.mobile.src || bgImageMeta.large.src ?
                  <picture
                    style={{
                      height: '100%',
                    }}
                  >
                    {bgImageMeta.mobile.src ?
                      <source
                        data-test={bgImageMeta.mobile.type}
                        media="(max-width: 1024px)"
                        srcSet={bgImageMeta.mobile.src}
                      />
                    : null}

                    {bgImageMeta.large.src ?
                      <img
                        alt="Marketing Banner Background"
                        data-test={bgImageMeta.large.type}
                        src={bgImageMeta.large.src}
                        style={{
                          objectFit: 'cover',
                          height: '100%',
                        }}
                      />
                    : null}
                  </picture>
                : null}
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          background="transparent"
          color="white"
          data-test="marketing-content"
          display="flex"
          flexDirection="row"
          height={BANNER_HEIGHTS}
          left="0"
          position="absolute"
          top="0"
          width="100%"
        >
          <Box
            alignItems="flex-start"
            alignSelf="center"
            display="flex"
            flexDirection="column"
            maxWidth={{
              mobile: '55%',
              medium: '70%',
              large: '50%',
              xlarge: '55%',
            }}
            paddingLeft={{ mobile: '$16', large: '$32' }}
            rowGap="$12"
          >
            {title ?
              <Text as="p" kind={{ mobile: 'h4', xlarge: 'h2' }} lines={4}>
                {title}
              </Text>
            : null}
            {description ?
              <Text
                as="p"
                css={{
                  fontWeight: '300',
                }}
                kind={{ mobile: 'body-4', xlarge: 'h3' }}
                lines={4}
              >
                {description}
              </Text>
            : null}
            {ctaUrl && ctaText ?
              <Button
                color="white"
                href={ctaUrl}
                kind="primary"
                onPress={() => {
                  analytics.track({
                    type: EventType.enum.Click,
                    data: {
                      view: {
                        section: {
                          name: toSnakeCase(title) ?? 'marketing_banner',
                        },
                        pageName,
                      },
                      event: {
                        location: 'marketing_banner_button',
                      },
                      pageName,
                      window: {
                        location: {
                          href: window.location.href,
                        },
                      },
                    },
                  });
                }}
                size={{ mobile: 'small', medium: 'large' }}
                target="_blank"
                textColor={vars.color.brandRed}
              >
                {ctaText}
              </Button>
            : null}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
