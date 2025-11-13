import { type IconProps, Icon } from '../components/icon/icon.js';

export function WarningFilled(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="Warning Filled" {...props}>
      <svg viewBox="0 0 24 24">
        <path
          clipRule="evenodd"
          d="M12.8 2.5a.9.9 0 0 0-1.6 0l-10 18.1c-.4.6 0 1.4.7 1.4h20.2c.7 0 1.1-.8.8-1.4L12.8 2.5Zm-.8 12a1 1 0 0 1-1-1v-4c0-.6.4-1 1-1s1 .4 1 1v4c0 .6-.4 1-1 1Zm0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
          fillRule="evenodd"
        />
      </svg>
    </Icon>
  );
}
