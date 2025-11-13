import { type IconProps, Icon } from '../components/icon/icon.js';

export function ChevronDown(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="Chevron Down" {...props}>
      <svg viewBox="0 0 24 24">
        <path d="m16.1611 8.77405-4.1665 4.16645-4.16641-4.16645c-.41879-.41879-1.0953-.41879-1.5141 0-.41879.4188-.41879 1.09531 0 1.51405L11.243 15.217c.4187.4188 1.0953.4188 1.514 0l4.9289-4.9289c.4188-.41874.4188-1.09525 0-1.51405-.4188-.40805-1.106-.41879-1.5248 0Z" />
      </svg>
    </Icon>
  );
}
