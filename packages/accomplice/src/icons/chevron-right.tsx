import { type IconProps, Icon } from '../components/icon/icon.js';

export function ChevronRight(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="Chevron Right" {...props}>
      <svg viewBox="0 0 24 24">
        <path d="M8.7743 6.3157c-.41912.41912-.41912 1.09616 0 1.51527l4.1697 4.16973-4.1697 4.1697c-.41912.4191-.41912 1.0961 0 1.5153.41912.4191 1.09616.4191 1.5153 0l4.9327-4.9328c.4191-.4191.4191-1.0961 0-1.5152l-4.9327-4.93275c-.40839-.40837-1.09618-.40837-1.5153.01075Z" />
      </svg>
    </Icon>
  );
}
