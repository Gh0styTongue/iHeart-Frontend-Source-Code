import { type IconProps, Icon } from '../components/icon/icon.js';

export function ChevronLeft(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="Chevron Left" {...props}>
      <svg viewBox="0 0 24 24">
        <path d="M15.217 6.31409C14.7982 5.8953 14.1217 5.8953 13.7029 6.31409L8.77405 11.243C8.35526 11.6617 8.35526 12.3383 8.77405 12.757L13.7029 17.6859C14.1217 18.1047 14.7982 18.1047 15.217 17.6859C15.6358 17.2671 15.6358 16.5906 15.217 16.1718L11.0506 11.9946L15.217 7.82819C15.6251 7.4094 15.6251 6.72215 15.217 6.31409Z" />
      </svg>
    </Icon>
  );
}
