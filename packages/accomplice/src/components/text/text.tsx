import type { ElementType, ReactNode } from 'react';
import { isPlainObject, mergeAll, omit } from 'remeda';
import type { ValueOf } from 'type-fest';

import {
  type ExternalGlobalStyles,
  externalGlobalStyles,
} from '../../external-global/external-global-style.css.js';
import { useMapMediaProp } from '../../hooks/use-mapmedia-prop.js';
import {
  type RainbowSprinkles,
  rainbowSprinkles,
} from '../../rainbow-sprinkles.css.js';
import type { ElementProps } from '../../types.js';
import type { MediaValue } from '../../types/index.js';
import { joinClassnames } from '../../utilities/internal.js';
import type { allowedElements, Kind } from './kind.js';
import { kinds, kindToElementMapping } from './kind.js';
import { lineClampStyles } from './text.css.js';

export type TextProps = {
  as?: Extract<ElementType, ValueOf<typeof allowedElements>>;
  children?: ReactNode;
  css?: RainbowSprinkles;
  kind: Kind | MediaValue<Kind>;
  width?: RainbowSprinkles['width'];
  lines?: keyof typeof lineClampStyles;
  externalStyle?: ExternalGlobalStyles;
  positionAnchor?: string;
} & ElementProps<'p'>;

export function Text(props: TextProps) {
  const {
    children,
    css,
    externalStyle = '',
    lines,
    positionAnchor,
    ref,
    ...restProps
  } = props;

  if (!restProps.as) {
    if (!restProps.kind) {
      throw new Error('You must pass a `kind` prop to the Text component.');
    }

    if (typeof restProps.kind !== 'string') {
      throw new TypeError(
        'You must pass an explicit `as` prop when passing an object to the `kind` prop',
      );
    }
  }

  const kindCSS = useMapMediaProp(
    restProps.kind,
    (value: keyof typeof kinds) => kinds[value],
  );

  const { className, style, otherProps } = rainbowSprinkles({
    ...mergeAll([{ margin: 0 }, omit(restProps, ['tabIndex']), kindCSS, css]),
  });

  const Component =
    restProps.as ?? kindToElementMapping[restProps.kind as Kind];

  if (!Component) {
    throw new Error('You must provide the correct mapping for the kind prop.');
  }

  // once we will have support of postion-anchor in vanilla extract then we will not need to add this way
  return (
    <Component
      className={joinClassnames([
        lines ? lineClampStyles[lines] : '',
        className,
        externalGlobalStyles[externalStyle],
      ])}
      data-kind={
        isPlainObject(restProps.kind) ?
          JSON.stringify(restProps.kind)
        : restProps.kind
      }
      ref={ref}
      style={{ ...style, positionAnchor }}
      {...otherProps}
    >
      {children}
    </Component>
  );
}
