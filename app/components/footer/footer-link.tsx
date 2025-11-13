import { Link } from '@iheartradio/web.accomplice/components/link';
import { Text } from '@iheartradio/web.accomplice/components/text';
import type { ReactNode } from 'react';

type FooterLinkProps = {
  link: string;
  target?: string;
  children?: ReactNode;
};

export const FooterLink = ({ link, children }: FooterLinkProps) => {
  return (
    <Text as="li" css={{ listStyle: 'none' }} kind="caption-4">
      <Link color="secondary" href={link} target="_blank" underline="hover">
        {children}
      </Link>
    </Text>
  );
};
