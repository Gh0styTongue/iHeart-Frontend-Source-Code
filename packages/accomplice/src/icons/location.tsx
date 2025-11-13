import { type IconProps, Icon } from '../components/icon/icon.js';

export function Location(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="Location" {...props}>
      <svg viewBox="0 0 24 24">
        <path d="M17.85 9.33C17.85 5.83 15.23 3 12 3 8.77 3 6.15 5.84 6.15 9.33 6.15 14.61 12 21 12 21s5.85-6.4 5.85-11.67Zm-8.63-.28c0-1.63 1.24-2.95 2.78-2.95 1.54 0 2.78 1.32 2.78 2.95 0 1.63-1.24 2.95-2.78 2.95-1.54 0-2.78-1.32-2.78-2.95Z" />
      </svg>
    </Icon>
  );
}
