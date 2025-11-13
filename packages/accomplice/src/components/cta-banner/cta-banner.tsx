import { Box } from '../box/box.js';
import { Flex } from '../flex/flex.js';
import { Text } from '../text/text.js';
import { gradientBoxStyles } from './cta-banner.css.js';

export interface CTABannerProps<K> {
  title: string;
  description: string;
  containerHeight?: string;
  buttons?: React.ReactNode;
  images?: React.ReactNode;
  children?: React.ReactNode;
  carouselKind?: K;
  EmptyState?: React.ReactElement;
}

const DefaultEmptyState: React.ReactElement = <></>;

export const CTABanner = <K,>({
  title,
  carouselKind,
  containerHeight,
  description,
  buttons,
  images,
  EmptyState = DefaultEmptyState,
}: CTABannerProps<K>) => {
  return (
    <Box
      display="grid"
      gridTemplateAreas="'content'"
      paddingY={!carouselKind ? { mobile: '$16', large: '$32' } : {}}
      position="relative"
    >
      {EmptyState}
      <Box gridArea="content" height="100%" position="relative" width="100%">
        <Flex
          direction="row"
          height={containerHeight || '100%'}
          justifyContent="center"
          overflow="hidden"
          position="relative"
          zIndex="$0"
        >
          <Box className={gradientBoxStyles} />
          <Flex
            alignItems="center"
            direction="row"
            gap={{ mobile: '$12', shmedium: '$16', large: '$64' }}
            justifyContent="center"
            paddingX={{ mobile: '$16', large: '$32' }}
            zIndex="$2"
          >
            <Flex
              direction="column"
              gap={{ mobile: '$12', shmedium: '$16' }}
              justifyContent="center"
            >
              <Flex
                direction="column"
                gap={{ mobile: '$0', shmedium: '$4' }}
                justifyContent="center"
              >
                <Text as="h3" kind={{ mobile: 'h4', large: 'h3' }} lines={2}>
                  {title}
                </Text>
                <Text
                  as="p"
                  kind={{ mobile: 'body-4', shmedium: 'body-3' }}
                  lines={2}
                >
                  {description}
                </Text>
              </Flex>
              {buttons ?
                <Flex direction="row" gap="$12">
                  {buttons}
                </Flex>
              : null}
            </Flex>
            {images}
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
