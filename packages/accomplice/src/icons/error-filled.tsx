import { type IconProps, Icon } from '../components/icon/icon.js';

export function ErrorFilled(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="Error Filled" {...props}>
      <svg viewBox="0 0 24 24">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 11a1 1 0 0 1-1-1V8c0-.5.4-1 1-1s1 .5 1 1v4c0 .6-.4 1-1 1Zm1 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
      </svg>
    </Icon>
  );
}
