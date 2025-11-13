import { type IconProps, Icon } from '../components/icon/icon.js';

export function SkipBack(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="Skip Back" {...props}>
      <svg viewBox="0 0 24 24">
        <path d="M7 6c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1Zm3.66 6.82 5.77 4.07c.66.47 1.58-.01 1.58-.82V7.93c0-.81-.91-1.28-1.58-.82l-5.77 4.07c-.57.4-.57 1.24 0 1.64Z" />
      </svg>
    </Icon>
  );
}
