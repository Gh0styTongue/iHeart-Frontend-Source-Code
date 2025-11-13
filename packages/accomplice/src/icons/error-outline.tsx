import { type IconProps, Icon } from '../components/icon/icon.js';

export function ErrorOutline(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="Error Outline" {...props}>
      <svg viewBox="0 0 24 24">
        <path d="M12 13a1 1 0 0 1-1-1V8c0-.5.4-1 1-1s1 .5 1 1v4c0 .6-.4 1-1 1Zm0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
        <path
          clipRule="evenodd"
          d="M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0Zm2 0a8 8 0 1 0 16 0 8 8 0 0 0-16 0Z"
          fillRule="evenodd"
        />
      </svg>
    </Icon>
  );
}
