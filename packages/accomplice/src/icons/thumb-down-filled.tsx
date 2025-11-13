import { type IconProps, Icon } from '../components/icon/icon.js';

export function ThumbDownFilled(props: Omit<IconProps, 'children'>) {
  return (
    <Icon aria-label="Thumb Down Filled" {...props}>
      <svg viewBox="0 0 32 32">
        <path
          clipRule="evenodd"
          d="m13.735 19.186-0.9148 4.4105c-0.0962 0.4815 0.0482 0.9727 0.3949 1.3194 0.5681 0.5585 1.4732 0.5585 2.0319-0.0097l5.3254-5.335c0.3562-0.3563 0.5586-0.8475 0.5586-1.3579v-9.6204c0-1.0593-0.8668-1.926-1.926-1.926h-8.6574c-0.77045 0-1.4638 0.46224-1.7624 1.1652l-3.1394 7.3285c-0.81865 1.9068 0.5779 4.0254 2.6483 4.0254h5.4409z"
          fillRule="evenodd"
        />
        <path d="m24.668 6.667c-1.0637 0-1.926 0.86231-1.926 1.926v7.704c0 1.0638 0.8623 1.9261 1.926 1.9261s1.926-0.8623 1.926-1.9261v-7.704c0-1.0637-0.8623-1.926-1.926-1.926z" />
      </svg>
    </Icon>
  );
}
