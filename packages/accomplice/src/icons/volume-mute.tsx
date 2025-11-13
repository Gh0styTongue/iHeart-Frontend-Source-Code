import { type IconProps, Icon } from '../components/icon/icon.js';

export function VolumeMute(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="Volume Mute" {...props}>
      <svg viewBox="0 0 24 24">
        <path d="M3 10.005v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.415c0-.89-1.08-1.34-1.71-.71L7 9.005H4c-.55 0-1 .45-1 1z" />
      </svg>
    </Icon>
  );
}
