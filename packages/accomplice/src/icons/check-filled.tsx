import { type IconProps, Icon } from '../components/icon/icon.js';

export function CheckFilled(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="Check Filled" {...props}>
      <svg viewBox="0 0 24 24">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM9.29 16.29 5.7 12.7a1 1 0 1 1 1.41-1.41L10 14.17l6.88-6.88a1 1 0 1 1 1.41 1.41l-7.59 7.59a1 1 0 0 1-1.41 0Z" />
      </svg>
    </Icon>
  );
}
