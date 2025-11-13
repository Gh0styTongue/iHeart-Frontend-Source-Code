import {
  breakpoints,
  lightDark,
  mergeProps,
  vars,
} from '@iheartradio/web.accomplice';
import { Box } from '@iheartradio/web.accomplice/components/box';
import {
  type CardProps,
  Card,
  CardBody,
  CardImage,
  CardPreview,
} from '@iheartradio/web.accomplice/components/card';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import { Link } from '@iheartradio/web.accomplice/components/link';
import {
  type TextProps,
  Text,
} from '@iheartradio/web.accomplice/components/text';
import {
  useFocusWithin,
  useHover,
  usePress,
  useRouter,
  useSyntheticLinkProps,
} from '@iheartradio/web.accomplice/hooks';
import {
  type MediaServerURL,
  getResponsiveImgAttributes,
} from '@iheartradio/web.assets';
import type { ReactNode } from 'react';
import { useCallback, useRef, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';

import { useItemSelected } from '~app/analytics/use-item-selected';

function NumberRank({
  rank,
  focus,
  noAnchorToImage,
}: {
  rank: number;
  focus: boolean;
  noAnchorToImage?: boolean;
}) {
  const numberStyles: TextProps['css'] = {
    fontSize: { mobile: '5rem', shmedium: '7rem', large: '9rem' },
    lineHeight: 1,
    color:
      focus ?
        lightDark(vars.color.red600, vars.color.red300)
      : lightDark(vars.color.gray100, vars.color.brandBlack),
    fontWeight: '600',
    userSelect: 'none',
    // @ts-expect-error This isn't supported on the type level but functions as expected
    WebkitTextStrokeWidth: focus ? '0' : vars.stroke[1],
    // @ts-expect-error: unable to type WebkitTextStrokeColor
    WebkitTextStrokeColor: lightDark(vars.color.red600, vars.color.red300),
    cursor: 'pointer',
    bottom: noAnchorToImage ? 'unset' : 'anchor(bottom)',
    position: 'absolute',
    transition: 'all ease 300ms',
    textShadow: vars.shadow.elevation1,
  };

  return rank === 10 ?
      <>
        <Text
          aria-hidden="true"
          as="p"
          css={{
            ...numberStyles,
            marginLeft: {
              mobile: '-1.4rem',
              shmedium: '-1.2rem',
              large: '-1.5rem',
            },
          }}
          kind="h3"
          positionAnchor="--image"
        >
          1
        </Text>
        <Text
          aria-hidden="true"
          as="p"
          css={{
            ...numberStyles,
            marginRight: {
              mobile: '-0.4rem',
              shmedium: '-0.7rem',
              large: '-0.9rem',
            },
            marginLeft: { mobile: '0.2rem', medium: '1.1rem', large: '1.3rem' },
          }}
          kind="h3"
          positionAnchor="--image"
        >
          0
        </Text>
      </>
    : <Text
        aria-hidden="true"
        as="p"
        css={{
          ...numberStyles,
          marginRight: { mobile: '-0.4rem', large: '-1.2rem' },
        }}
        kind="h3"
        positionAnchor="--image"
      >
        {rank}
      </Text>;
}

export type TrendingCardProps = Omit<CardProps, 'onPress'> & {
  active?: boolean;
  children?: ReactNode;
  href: string;
  image: string | URL | MediaServerURL;
  rank?: number;
  target: '_blank' | '_self';
  title: string;
  pageName: string;
  index: number;
};

export function TrendingCard(props: TrendingCardProps) {
  const { onItemSelected } = useItemSelected();
  const [isFocused, setIsFocused] = useState(false);
  const {
    active,
    image,
    title,
    index,
    rank,
    href,
    target,
    pageName,
    routerOptions,
  } = props;

  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const syntheticLinkProps = useSyntheticLinkProps(props);

  const isInternalLink =
    href.includes('/artist') ||
    href.includes('/browse') ||
    href.includes('/live') ||
    href.includes('/playlist') ||
    href.includes('/podcast') ||
    href.includes('/search') ||
    href.includes('/spotlight');

  const { isHovered, hoverProps } = useHover(props);
  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange: isFocusWithin => setIsFocused(isFocusWithin),
  });

  const isDoubleColumn = useMediaQuery(breakpoints.medium);

  // Column will always be 0 if on mobile breakpoints, but on desktop there are two - this is to
  // determine which column the card is in for analytics purposes
  const column =
    !isDoubleColumn ? 0
    : (index + 1) % 2 === 0 ? 1
    : 0;

  const row = isDoubleColumn ? Math.floor(index / 2) : index;

  const onNavigation = useCallback(() => {
    onItemSelected({
      pageName,
      section: 'trending_on_iheart',
      sectionPosition: 0,
      itemPosition: column,
      row,
      context: isDoubleColumn ? 'grid' : 'list',
      assets: {
        asset: {
          name: title ?? '',
        },
      },
      contentTitle: !isInternalLink ? title : undefined,
    });
  }, [
    column,
    isDoubleColumn,
    isInternalLink,
    onItemSelected,
    pageName,
    row,
    title,
  ]);

  const responsiveProps = getResponsiveImgAttributes(image, {
    width: 100,
    ratio: [1, 1],
  });

  const { isPressed, pressProps } = usePress({
    onPress: event => {
      if (ref.current && href) {
        onNavigation?.();
        router.open(ref.current, event, href, routerOptions);
      }
    },
  });

  return (
    <Flex
      alignItems="center"
      cursor="pointer"
      data-hovered={isHovered || undefined}
      data-pressed={isPressed || undefined}
      data-test="trending-card-container"
      height="inherit"
      paddingBottom={vars.space[2]}
      paddingRight={vars.space[2]}
      paddingTop={vars.space[2]}
      position="relative"
      ref={ref}
      {...mergeProps(
        hoverProps,
        pressProps,
        focusWithinProps,
        syntheticLinkProps,
      )}
    >
      {rank !== undefined && (
        <Box
          alignItems="center"
          data-test="trending-card-rank"
          display="flex"
          height={{ mobile: '5rem', shmedium: '7rem', large: '8rem' }}
          width={{ mobile: '2.9rem', shmedium: '3.9rem', large: '5.2rem' }}
        >
          <NumberRank
            {...{ rank, focus: isHovered || isFocused }}
            noAnchorToImage
          />
        </Box>
      )}
      <Box height={{ mobile: '6.4rem', large: '9.8rem' }} width="100%">
        <Card
          data-test="trending-card"
          href={href}
          isActive={active}
          isHovered={isHovered}
          onNavigation={onNavigation}
          orientation="horizontal"
          tabIndex={0}
          target={target}
        >
          <CardPreview>
            <Box asChild borderRadius="unset" boxShadow="unset">
              <CardImage
                alt={title ?? 'trending card image'}
                aspectRatio="1 / 1"
                {...responsiveProps}
              />
            </Box>
          </CardPreview>
          <CardBody>
            <Text
              as="p"
              kind={{ mobile: 'subtitle-4', large: 'subtitle-2' }}
              lines={2}
            >
              {title}
            </Text>
          </CardBody>
        </Card>
      </Box>
    </Flex>
  );
}

TrendingCard.Link = Link;
