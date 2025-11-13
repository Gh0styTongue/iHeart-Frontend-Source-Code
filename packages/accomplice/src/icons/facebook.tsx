import { type IconProps, Icon } from '../components/icon/icon.js';

export function Facebook(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="Facebook" {...props}>
      <svg viewBox="0 0 18 18">
        <path d="M18 9.05a9 9 0 1 0-10.4 8.9v-6.3H5.3v-2.6h2.3V7.07c0-2.26 1.34-3.5 3.4-3.5.98 0 2 .17 2 .17v2.22h-1.13c-1.12 0-1.46.7-1.46 1.4v1.69h2.5l-.4 2.6h-2.1v6.3A9 9 0 0 0 18 9.04Z" />
      </svg>
    </Icon>
  );
}
