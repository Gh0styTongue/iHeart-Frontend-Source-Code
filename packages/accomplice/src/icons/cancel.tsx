import { type IconProps, Icon } from '../components/icon/icon.js';

export function Cancel(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="Cancel" {...props}>
      <svg viewBox="0 0 24 24">
        <path d="M18.3 5.70997c-.39-.39-1.02-.39-1.41 0L12 10.59 7.10997 5.69997c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12l-4.89003 4.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89003c.38-.38.38-1.02 0-1.4Z" />
      </svg>
    </Icon>
  );
}
