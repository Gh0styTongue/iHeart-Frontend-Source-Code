import { type IconProps, Icon } from '../components/icon/icon.js';

export function EllipsisHorizontal(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="Ellipsis Horizontal" {...props}>
      <svg viewBox="0 0 24 24">
        <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Z" />
      </svg>
    </Icon>
  );
}
