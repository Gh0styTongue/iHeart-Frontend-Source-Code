import { lightDark, vars } from '@iheartradio/web.accomplice';
import { Box } from '@iheartradio/web.accomplice/components/box';
import type { IconProps } from '@iheartradio/web.accomplice/components/icon';
import { Link } from '@iheartradio/web.accomplice/components/link';
import type { JSX } from 'react';

export type FooterSocialProps = {
  name: string;
  link: string;
  icon: (props: Omit<IconProps, 'children'>) => JSX.Element;
};

export const FooterSocial = ({
  name,
  link,
  icon: IconComponent,
}: FooterSocialProps) => (
  <Box asChild listStyle="none">
    <li>
      <Link
        css={{
          display: 'inline-block',
          borderRadius: '$999',
          padding: '$4',
          fontSize: 0,
          transition: 'all 200ms ease',
          outline: {
            default: 'none',
            focus: 'none',
          },
          backgroundColor: {
            active: lightDark('$gray200', '$gray500'),
            hover: lightDark('$gray300', '$gray400'),
          },
        }}
        data-test={name}
        href={link}
        rel="noreferrer"
        target="_blank"
      >
        <IconComponent
          color={lightDark(vars.color.gray450, vars.color.brandWhite)}
          size={24}
        />
      </Link>
    </li>
  </Box>
);
