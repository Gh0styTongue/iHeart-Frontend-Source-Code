import type { ComponentType, ReactNode } from 'react';

import { lightDark } from '../../media.js';
import { sprinkles } from '../../sprinkles.css.js';
import { vars } from '../../theme-contract.css.js';
import type { IconProps } from '../icon/icon.js';
import { Text } from '../text/text.js';
import { iconStyle } from './illustrated-message.css.js';

export interface IllustratedMessageProps {
  description: string;
  title: string;
  icon: ComponentType<Omit<IconProps, 'children'>>;
  cta?: ReactNode;
}

/**
 * The `<IllustratedMessage />` component is used to communicate to the user that the view is empty and there is no relevant data to display. This is useful in situations where there aren't any followed stations in "Your Library" or where searching the app returned no results.
 */

export function IllustratedMessage({
  description,
  title,
  icon: IconComponent,
  cta,
  ...props
}: IllustratedMessageProps) {
  return (
    <div
      className={sprinkles({
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        gap: { mobile: '16', large: '24' },
        justifyContent: 'center',
        padding: '24',
      })}
      {...props}
    >
      <IconComponent
        className={iconStyle}
        data-test="illustrated-message-icon"
        fill={lightDark(vars.color.gray300, vars.color.gray500)}
        size={{ mobile: 96, large: 124 }}
      />
      <div
        className={sprinkles({
          display: 'flex',
          flexDirection: 'column',
          gap: '8',
        })}
      >
        <Text
          as="h4"
          color={lightDark('$gray600', '$brandWhite')}
          css={{ textAlign: 'center' }}
          data-test="illustrated-message-title"
          kind={{
            mobile: 'h4',
            large: 'h3',
          }}
        >
          {title}
        </Text>
        <Text
          as="p"
          color={lightDark('$gray450', '$gray250')}
          css={{ textAlign: 'center' }}
          data-test="illustrated-message-description"
          kind={{
            mobile: 'body-3',
            large: 'body-2',
          }}
        >
          {description}
        </Text>
      </div>
      {cta}
    </div>
  );
}
