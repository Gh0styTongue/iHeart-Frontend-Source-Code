import { type IconProps, Icon } from '../components/icon/icon.js';

export function Play(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="Play Icon" {...props}>
      <svg viewBox="0 0 24 24">
        <path d="M8.07007 6.97202V17.028c0 .7668.84447 1.2327 1.4948.8153l7.90113-5.028c.6018-.3785.6018-1.2521 0-1.6404L9.56487 6.15667c-.65033-.41738-1.4948.04853-1.4948.81535Z" />
      </svg>
    </Icon>
  );
}
