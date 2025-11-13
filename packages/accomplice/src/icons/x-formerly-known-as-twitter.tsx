import { type IconProps, Icon } from '../components/icon/icon.js';

export function XFormerlyKnownAsTwitter(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="X Formerly Known As Twitter" {...props}>
      <svg viewBox="0 0 24 24">
        <path d="M13.71 10.62 20.41 3h-1.58L13 9.62 8.36 3H3l7.03 10L3 21h1.59l6.14-6.99L15.64 21H21l-7.29-10.38Zm-2.17 2.48-.71-1-5.67-7.93H7.6l4.57 6.4.71 1 5.95 8.31h-2.44l-4.85-6.78Z" />
      </svg>
    </Icon>
  );
}
