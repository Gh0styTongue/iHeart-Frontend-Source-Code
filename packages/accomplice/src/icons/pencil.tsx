import { type IconProps, Icon } from '../components/icon/icon.js';

export function Pencil(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="Pencil" {...props}>
      <svg viewBox="0 0 24 24">
        <path d="M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1a.5.5 0 0 0-.15.36ZM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z" />
      </svg>
    </Icon>
  );
}
