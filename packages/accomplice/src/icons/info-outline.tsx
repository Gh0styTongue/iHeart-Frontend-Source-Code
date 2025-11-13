import { type IconProps, Icon } from '../components/icon/icon.js';

export function InfoOutline(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="Info Outline" {...props}>
      <svg viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8Z" />
        <path d="M13 12c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1s1-.45 1-1v-4ZM13 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z" />
      </svg>
    </Icon>
  );
}
