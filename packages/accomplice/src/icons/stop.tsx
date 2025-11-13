import { type IconProps, Icon } from '../components/icon/icon.js';

export function Stop(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="Stop" {...props}>
      <svg viewBox="0 0 24 24">
        <path d="M8 6h8c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2Z" />
      </svg>
    </Icon>
  );
}
