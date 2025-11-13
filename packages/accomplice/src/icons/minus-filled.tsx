import { type IconProps, Icon } from '../components/icon/icon.js';
export function MinusFilled(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="Minus Filled" {...props}>
      <svg viewBox="0 0 24 24">
        <path
          clipRule="evenodd"
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM6 11C5.44772 11 5 11.4477 5 12C5 12.5523 5.44772 13 6 13H18C18.5523 13 19 12.5523 19 12C19 11.4477 18.5523 11 18 11H6Z"
          fillRule="evenodd"
        />
      </svg>
    </Icon>
  );
}
