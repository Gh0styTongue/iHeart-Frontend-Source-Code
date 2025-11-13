import { type IconProps, Icon } from '../components/icon/icon.js';

export function InfoFilled(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="Info Filled" {...props}>
      <svg viewBox="0 0 24 24">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 15a1 1 0 0 1-1-1v-4c0-.6.4-1 1-1s1 .4 1 1v4c0 .6-.4 1-1 1Zm1-9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
      </svg>
    </Icon>
  );
}
