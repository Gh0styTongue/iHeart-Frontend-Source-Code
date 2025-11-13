import { useThrottledValue, useWindowScroll } from '@mantine/hooks';

export function useWindowScrollPosition() {
  const [scroll] = useWindowScroll();
  const throttledScrollValue = useThrottledValue(scroll, 100);
  return throttledScrollValue;
}
