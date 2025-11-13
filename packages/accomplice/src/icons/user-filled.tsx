import { type IconProps, Icon } from '../components/icon/icon.js';

export function UserFilled(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="User Filled" {...props}>
      <svg viewBox="0 0 24 24">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 14.2a7.2 7.2 0 0 1-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 0 1-6 3.22Z" />
      </svg>
    </Icon>
  );
}
