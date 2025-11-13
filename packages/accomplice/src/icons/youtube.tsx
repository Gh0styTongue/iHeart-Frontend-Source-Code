import { type IconProps, Icon } from '../components/icon/icon.js';

export function YouTube(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="You Tube" {...props}>
      <svg viewBox="0 0 24 24">
        <g clipPath="url(#a)">
          <path
            clipRule="evenodd"
            d="M21 4.49a2.87 2.87 0 0 1 2.03 2.01c.49 1.8.47 5.52.47 5.52s0 3.7-.47 5.5a2.87 2.87 0 0 1-2.03 2c-1.8.48-9 .48-9 .48s-7.18 0-9-.49A2.87 2.87 0 0 1 .97 17.5C.5 15.73.5 12 .5 12s0-3.7.47-5.5A2.93 2.93 0 0 1 3 4.47C4.8 4 12 4 12 4s7.2 0 9 .49ZM15.7 12l-6 3.43V8.57l6 3.43Z"
            fillRule="evenodd"
          />
        </g>
        <defs>
          <clipPath id="a">
            <path d="M0 0h24v24H0z" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </Icon>
  );
}
