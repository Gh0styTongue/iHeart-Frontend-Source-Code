import { type IconProps, Icon } from '../components/icon/icon.js';

export function Check(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="Check" {...props}>
      <svg viewBox="0 0 24 24">
        <path d="m9.4 15.14-2.8-2.81a.8.8 0 1 0-1.15 1.14l3.39 3.39a.8.8 0 0 0 1.14 0l8.57-8.58a.8.8 0 1 0-1.14-1.14l-8 8Z" />
      </svg>
    </Icon>
  );
}
