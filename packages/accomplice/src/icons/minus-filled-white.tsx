import { type IconProps, Icon } from '../components/icon/icon.js';

export function MinusFilledWhite(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="Minus Filled" {...props}>
      <svg viewBox="0 0 24 24">
        <path
          clipRule="evenodd"
          d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM6 11a1 1 0 1 0 0 2h12a1 1 0 1 0 0-2H6Z"
          fillRule="evenodd"
        />
        <path
          clipRule="evenodd"
          d="M5 12c0-.6.4-1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Z"
          fill="white"
          fillRule="evenodd"
        />
      </svg>
    </Icon>
  );
}
