import { type IconProps, Icon } from '../components/icon/icon.js';

export function VolumeLow(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="Volume Low" {...props}>
      <svg viewBox="0 0 24 24">
        <path d="M3 10v4c0 .6.5 1 1 1h3l3.3 3.3a1 1 0 0 0 1.7-.7V6.4a1 1 0 0 0-1.7-.7L7 9H4a1 1 0 0 0-1 1Zm13.5 2c0-1.8-1-3.3-2.5-4v8a4.5 4.5 0 0 0 2.5-4Z" />
      </svg>
    </Icon>
  );
}
