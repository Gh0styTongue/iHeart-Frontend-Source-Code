import { type IconProps, Icon } from '../components/icon/icon.js';

export function Preset(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="Preset" {...props}>
      <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 4.5C3 3.67157 3.67157 3 4.5 3H8V8.00023H3V4.5Z" />
        <path d="m9.9998 3h3.5c0.8284 0 1.5 0.67157 1.5 1.5v3.5002h-5v-5.0002z" />
        <path d="m3 10h5v5.0002h-3.5c-0.82843 0-1.5-0.6716-1.5-1.5v-3.5002z" />
        <path d="m9.9998 10h5v3.5002c0 0.8284-0.6716 1.5-1.5 1.5h-3.5v-5.0002z" />
      </svg>
    </Icon>
  );
}
