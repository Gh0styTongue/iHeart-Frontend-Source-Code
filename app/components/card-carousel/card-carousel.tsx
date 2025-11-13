import { lightDark, vars } from '@iheartradio/web.accomplice';
import { Box } from '@iheartradio/web.accomplice/components/box';
import type {
  CarouselContentProps,
  CarouselContextProps,
  CarouselProps,
  CarouselSlideProps,
} from '@iheartradio/web.accomplice/components/carousel';
import {
  Carousel,
  CarouselContent,
  CarouselContext,
  CarouselHandler,
  CarouselSlide,
} from '@iheartradio/web.accomplice/components/carousel';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import { Text } from '@iheartradio/web.accomplice/components/text';
import { Loading } from '@iheartradio/web.accomplice/icons/loading';
import { rgba } from 'polished';
import {
  type ReactElement,
  type ReactNode,
  isValidElement,
  useContext,
  useMemo,
} from 'react';
import { firstBy, identity, isPlainObject, values } from 'remeda';

export type CardCarouselKind =
  | 'content'
  | 'featured'
  | 'news'
  | 'recently-played'
  | 'row'
  | 'ranker';

const getSlidesToShowMap = ({
  hasDescription,
}: {
  hasDescription?: boolean;
}): Record<CardCarouselKind, NonNullable<CarouselProps['slidesToShow']>> => {
  return {
    content: {
      xsmall: 3,
      small: 3,
      medium: hasDescription ? 3 : 4,
      large: hasDescription ? 3 : 5,
      xlarge: hasDescription ? 5 : 7,
    },
    featured: {
      xsmall: 1,
      small: 1,
      shmedium: 2,
      medium: 2,
      large: 2,
      xlarge: 3,
    },
    ranker: {
      xsmall: 2,
      small: 3,
      medium: 4,
      xlarge: 5,
      xxlarge: 6,
    },
    news: {
      xsmall: 2,
      small: 2,
      medium: 3,
      large: 3,
      xlarge: 5,
    },
    'recently-played': {
      xsmall: 4,
      small: 5,
      medium: 6,
      large: 6,
      xlarge: 8,
    },
    row: {
      xsmall: 1,
      small: 1,
      medium: 2,
      large: 1,
      xlarge: 2,
    },
  };
};

export type CardCarouselProps<T extends object = object> = {
  gradientColor?: string;
  children?: CarouselContentProps<T>['children'];
  description?: ReactNode;
  dependencies?: CarouselContentProps<T>['dependencies'];
  handler?: ReactElement;
  isLoading?: boolean;
  renderEmptyState?: CarouselContentProps<T>['renderEmptyState'];
  items?: CarouselContentProps<T>['items'];
  kind: CardCarouselKind;
  title?: ReactNode;
  showScrollButtons?: boolean;
  slideGap?: CarouselProps['slideGap'];
};

export function CardCarouselEmptyState() {
  return (
    <Flex
      alignItems="center"
      height={{ mobile: '18rem', large: '21rem' }}
      justifyContent="center"
      width="100%"
    >
      <Text
        as="p"
        color={lightDark(vars.color.gray600, vars.color.gray300)}
        kind="body-3"
      >
        No results currently available for this filter
      </Text>
    </Flex>
  );
}

export function CardCarousel<T extends object>(props: CardCarouselProps<T>) {
  const {
    gradientColor,
    title,
    description,
    dependencies,
    children,
    handler,
    isLoading,
    items,
    kind,
    showScrollButtons,
    renderEmptyState,
    ...restProps
  } = props;

  const slidesToShow = getSlidesToShowMap({ hasDescription: !!description })[
    kind
  ];

  const carouselContent = (
    <Carousel {...restProps} isLoading={isLoading} slidesToShow={slidesToShow}>
      {isValidElement(handler) ?
        handler
      : <CarouselHandler showScrollButtons={showScrollButtons}>
          {!description ?
            <Text
              as={title ? 'h3' : 'div'} // changed from h3 to div if no title as blank headig element is not valid
              css={{
                color: lightDark(vars.color.gray600, vars.color.brandWhite),
              }}
              kind={{ mobile: 'h4', large: 'h3' }}
            >
              {title}
            </Text>
          : null}
        </CarouselHandler>
      }
      <Box position="relative">
        {isLoading ?
          <Flex
            // These colors are the main background colors with 0.5 opacity applied
            backgroundColor={lightDark(
              rgba('#F6F8F9', 0.5),
              rgba('#000000', 0.5),
            )}
            bottom="0"
            height="100%"
            left="0"
            pointerEvents="none"
            position="absolute"
            right="0"
            top="0"
            transition="background-color 200ms ease 300ms"
            width="100%"
            zIndex="$10"
          >
            <Flex
              alignItems="center"
              height="100%"
              justifyContent="center"
              transition="opacity 200ms ease 300ms"
              width="100%"
            >
              <Loading
                color={lightDark(vars.color.gray300, vars.color.brandWhite)}
                size={40}
              />
            </Flex>
          </Flex>
        : null}
        <CarouselContent<T>
          dependencies={dependencies}
          items={items}
          renderEmptyState={props => {
            const C = renderEmptyState ?? CardCarouselEmptyState;
            return <C {...props} />;
          }}
        >
          {children}
        </CarouselContent>
      </Box>
    </Carousel>
  );

  return (
    <Box
      background={
        gradientColor ?
          `linear-gradient(0.25turn, transparent, ${rgba(gradientColor, 0.3)} 50%, transparent)`
        : undefined
      }
      data-test="card-carousel"
      paddingY={{ mobile: '$16', large: '$32' }}
      position="relative"
      width="100%"
    >
      {description ?
        <Flex
          alignItems={{ mobile: 'left', medium: 'center' }}
          data-test="featured-layout"
          direction={{ mobile: 'column', medium: 'row' }}
        >
          <Flex
            alignItems="left"
            direction="column"
            gap="$8"
            minWidth={{
              medium: '$5',
              large: '$3',
              xlarge: '$3',
            }}
            padding={{ mobile: '$0 $16', large: '$0 $0 $0 $32' }}
          >
            <Text
              as="h3"
              css={{ width: '100%' }}
              kind={{ mobile: 'h4', large: 'h3' }}
            >
              {title}
            </Text>
            <Text as="p" kind={{ mobile: 'body-4', large: 'body-3' }}>
              {description}
            </Text>
          </Flex>
          {carouselContent}
        </Flex>
      : carouselContent}
    </Box>
  );
}

export type CardCarouselSlideProps<T extends object> = Omit<
  CarouselSlideProps<T>,
  'href' | 'onAction'
>;

export function CardCarouselSlide<T extends object>(
  props: CardCarouselSlideProps<T>,
) {
  return <CarouselSlide {...props} />;
}

export function useCardCarousel():
  | (CarouselContextProps & { maxSlidesToShow: number })
  | undefined {
  const contextValue = useContext(CarouselContext);

  return useMemo(() => {
    if (!contextValue) return undefined;

    return {
      ...contextValue,
      maxSlidesToShow:
        isPlainObject(contextValue.slidesToShow) ?
          (firstBy(values(contextValue.slidesToShow), [
            identity(),
            'desc',
          ]) as number)
        : contextValue.slidesToShow,
    };
  }, [contextValue]);
}
