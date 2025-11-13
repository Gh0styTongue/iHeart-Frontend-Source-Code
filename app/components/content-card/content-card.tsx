import { sprinkles } from '@iheartradio/web.accomplice';
import type {
  CardImageProps,
  CardPreviewProps,
  CardProps,
  CardTitleProps,
} from '@iheartradio/web.accomplice/components/card';
import {
  Card,
  CardBody,
  CardImage,
  CardPreview,
  CardPreviewOverlayButtonContainer,
  CardSubtitle,
  CardTitle,
} from '@iheartradio/web.accomplice/components/card';
import { Group } from '@iheartradio/web.accomplice/components/group';
import { getResponsiveImgAttributes } from '@iheartradio/web.assets';
import type { ReactNode } from 'react';
import { isNonNullish, isNullish } from 'remeda';
import type { SetOptional } from 'type-fest';

import { useImageLoadingProps } from '~app/hooks/use-image-loading-props';

export type ContentCardImageProps = SetOptional<CardImageProps, 'src'> & {
  index?: number;
};

export function ContentCardImage({
  src,
  index,
  ...props
}: ContentCardImageProps) {
  const { loadingProps } = useImageLoadingProps(index);

  if (isNullish(src)) {
    return null;
  }

  const responsiveProps = getResponsiveImgAttributes(src, {
    ratio: [1, 1],
    width: props.width ?? 150,
  });

  return (
    <CardImage
      {...loadingProps}
      {...props}
      {...responsiveProps}
      aspectRatio="1 / 1"
    />
  );
}

export type ContentCardProps = Omit<CardProps, 'onClick'> & {
  actions?: ReactNode;
  description?: ReactNode;
  image?: ReactNode;
  imageButton?: ReactNode;
  linesForTitle?: CardTitleProps['lines'];
  previewShape?: CardPreviewProps['shape'];
  title?: ReactNode;
};

export function ContentCard(props: ContentCardProps) {
  const {
    actions,
    className,
    description,
    image,
    imageButton,
    isActive,
    isFocused,
    isHovered,
    linesForTitle = 1,
    previewShape,
    title,
    onNavigation,
    ...restProps
  } = props;

  const showCardBody = isNonNullish(title) || isNonNullish(description);

  return (
    <Card
      {...restProps}
      className={className}
      data-test="content-card"
      isActive={isActive}
      isFocused={isFocused}
      isHovered={isHovered}
      onNavigation={onNavigation}
      orientation="vertical"
    >
      {/* 
        The order of these children (Body, Actions, Preview) is intentional to maintain the proper 
        tab order.

        The layout is managed with a grid which will order the elements in the expected way 
        (Preview, Body, Actions) visually regardless of their order in the DOM.
      */}
      {showCardBody ?
        <CardBody className={sprinkles({ textAlign: 'center' })}>
          {title ?
            <CardTitle lines={linesForTitle}>{title}</CardTitle>
          : null}
          {description ?
            <CardSubtitle lines={2}>{description}</CardSubtitle>
          : null}
        </CardBody>
      : null}
      {actions ?
        <Group>{actions}</Group>
      : null}
      <CardPreview shape={previewShape}>
        {image}
        <CardPreviewOverlayButtonContainer>
          {imageButton}
        </CardPreviewOverlayButtonContainer>
      </CardPreview>
    </Card>
  );
}
