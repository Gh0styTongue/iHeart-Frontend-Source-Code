import { type IconProps, Icon } from '../components/icon/icon.js';

export function Pause(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="Pause" {...props}>
      <svg viewBox="0 0 24 24">
        <path d="M8.56426 18c.94286 0 1.71424-.7714 1.71424-1.7143V7.71429C10.2785 6.77143 9.50712 6 8.56426 6s-1.71428.77143-1.71428 1.71429v8.57141c0 .9429.77142 1.7143 1.71428 1.7143ZM13.7071 7.71429v8.57141c0 .9429.7714 1.7143 1.7143 1.7143s1.7143-.7714 1.7143-1.7143V7.71429C17.1357 6.77143 16.3643 6 15.4214 6s-1.7143.77143-1.7143 1.71429Z" />
      </svg>
    </Icon>
  );
}
