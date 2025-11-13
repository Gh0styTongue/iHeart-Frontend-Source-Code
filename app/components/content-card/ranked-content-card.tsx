import {
  breakpoints,
  lightDark,
  mergeProps,
  vars,
} from '@iheartradio/web.accomplice';
import { Box } from '@iheartradio/web.accomplice/components/box';
import type {
  CardPreviewProps,
  CardProps,
  CardTitleProps,
} from '@iheartradio/web.accomplice/components/card';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import {
  type TextProps,
  Text,
} from '@iheartradio/web.accomplice/components/text';
import type {
  HoverProps,
  LinkDOMProps,
  PressEvent,
} from '@iheartradio/web.accomplice/hooks';
import {
  useHover,
  usePress,
  useRouter,
  useSyntheticLinkProps,
} from '@iheartradio/web.accomplice/hooks';
import { type ReactNode, useCallback, useRef } from 'react';
import type { SetRequired } from 'type-fest';
import { useMediaQuery } from 'usehooks-ts';

import { ContentCard } from './content-card';

export { ContentCardImage } from './content-card';

function NumberRank({
  rank,
  isFocused,
  isHovered,
}: {
  rank: number;
  isFocused: boolean;
  isHovered: boolean;
}) {
  const isLargeBreakpoint = useMediaQuery(breakpoints.large);

  const numberStyles: TextProps['css'] = {
    fontSize: { mobile: '5rem', shmedium: '7rem', large: '9rem' },
    lineHeight: 1,
    color:
      isLargeBreakpoint && (isFocused || isHovered) ?
        lightDark(vars.color.red600, vars.color.red300)
      : lightDark(vars.color.gray100, vars.color.brandBlack),
    fontWeight: '600',
    userSelect: 'none',
    // @ts-expect-error This isn't supported on the type level but functions as expected
    WebkitTextStrokeWidth:
      isLargeBreakpoint && (isFocused || isHovered) ? '0' : vars.stroke[1],
    // @ts-expect-error: unable to type WebkitTextStrokeColor
    WebkitTextStrokeColor: lightDark(vars.color.red600, vars.color.red300),
    cursor: 'pointer',
    bottom: 'anchor(bottom)',
    position: 'absolute',
    transition: 'all ease 300ms, bottom 0ms',
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
              mobile: '-1.6rem',
              shmedium: '-2rem',
              large: '-2.3rem',
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
              shmedium: '-1rem',
              large: '-1.5rem',
            },
            marginLeft: { medium: '0.2rem', large: '0.5rem' },
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

export type RankedContentCardProps = SetRequired<
  Omit<CardProps, 'onClick'>,
  'isFocused' | 'isHovered'
> &
  LinkDOMProps &
  HoverProps & {
    actions?: ReactNode;
    description?: ReactNode;
    href?: string;
    image?: ReactNode;
    imageButton?: ReactNode;
    linesForTitle?: CardTitleProps['lines'];
    previewShape?: CardPreviewProps['shape'];
    title?: ReactNode;
    rank: number;
  };

export function RankedContentCard(props: RankedContentCardProps) {
  const {
    rank,
    isFocused,
    isHovered: _isHovered,
    href,
    routerOptions,
    onNavigation,
    ...restProps
  } = props;

  const ref = useRef<HTMLDivElement>(null);
  const { hoverProps, isHovered } = useHover(props);
  const router = useRouter();
  const syntheticLinkProps = useSyntheticLinkProps(props);

  const onPress = useCallback(
    (event: PressEvent) => {
      restProps?.onPress?.(event);

      if (ref.current && href) {
        onNavigation?.();
        router.open(ref.current, event, href, routerOptions);
      }
    },
    [href, onNavigation, restProps, router, routerOptions],
  );

  const { isPressed, pressProps } = usePress({ onPress });

  return (
    <Flex
      alignItems="center"
      cursor="pointer"
      data-hovered={isHovered || _isHovered || undefined}
      data-pressed={isPressed || undefined}
      data-test="ranked-content-card"
      height="100%"
      paddingBottom={vars.space[2]}
      paddingRight={vars.space[2]}
      paddingTop={vars.space[2]}
      position="relative"
      ref={ref}
      {...mergeProps(hoverProps, pressProps, syntheticLinkProps)}
    >
      <Box
        height={{ mobile: '5rem', shmedium: '7rem', large: '8rem' }}
        width={{ mobile: '2.9rem', shmedium: '3.9rem', large: '5.2rem' }}
      >
        <NumberRank {...{ rank, isFocused, isHovered }} />
      </Box>
      <ContentCard
        {...restProps}
        isFocused={isFocused}
        isHovered={isHovered}
        onPress={onPress}
      />
    </Flex>
  );
}
