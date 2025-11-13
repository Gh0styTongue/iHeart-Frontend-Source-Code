import { type IconProps, Icon } from '../components/icon/icon.js';

export function Home(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="Home" {...props}>
      <svg viewBox="0 0 25 24">
        <path d="m22.3405 10.0454-9.1891-7.87341c-.2703-.22932-.8109-.22932-1.0811 0L2.88111 10.0454c-.18018.1528-.27027.3057-.27027.4586v10.8844c0 .3058.36036.6116.81081.6116H21.8c.4504 0 .8108-.3058.8108-.6116V10.504c0-.1529-.0901-.3058-.2703-.4586Z" />
      </svg>
    </Icon>
  );
}
