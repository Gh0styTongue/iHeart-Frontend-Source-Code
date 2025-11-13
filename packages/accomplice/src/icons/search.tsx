import { type IconProps, Icon } from '../components/icon/icon.js';

export function Search(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="Search" {...props}>
      <svg viewBox="0 0 24 24">
        <path
          clipRule="evenodd"
          d="M14.3 16.2A7.6 7.6 0 0 1 3 9.6C3 5.4 6.4 2 10.5 2 14.7 2 18 5.4 18 9.6c0 2-.7 3.7-1.8 5l4.5 5.4c.4.5.4 1.3-.1 1.7-.5.4-1.3.4-1.7-.1l-4.6-5.4Zm.8-6.6c0 2.6-2 4.6-4.6 4.6-2.5 0-4.6-2-4.6-4.6A4.7 4.7 0 0 1 10.5 5c2.5 0 4.6 2 4.6 4.6Z"
          fillRule="evenodd"
        />
      </svg>
    </Icon>
  );
}
