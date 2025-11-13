import {
  type ComponentProps,
  type JSX,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import type { ImageProps } from './image.js';

declare global {
  interface EventTarget {
    height: number;
    width: number;
  }
}

type Img = JSX.IntrinsicElements['img'];

export type UseImageProps = Pick<Img, 'src'>;

type UseImageState = {
  height: number;
  width: number;
  status: 'pending' | 'loaded' | 'failed';
};

type UseImageAction =
  | {
      type: 'LOADED';
    }
  | {
      type: 'SUCCEEDED';
      payload: {
        height: UseImageState['height'];
        width: UseImageState['width'];
      };
    }
  | {
      type: 'FAILED';
    };

const imageReducer = (
  state: UseImageState,
  action: UseImageAction,
): UseImageState => {
  switch (action.type) {
    case 'LOADED': {
      return {
        ...state,
        status: 'loaded',
      };
    }
    case 'SUCCEEDED': {
      return {
        ...state,
        status: 'loaded',
        width: action.payload.width,
        height: action.payload.height,
      };
    }
    case 'FAILED': {
      return {
        ...state,
        status: 'failed',
      };
    }
    default: {
      throw new TypeError('Unknown useImageReducer action type');
    }
  }
};

type ImgOnLoad = NonNullable<ComponentProps<'img'>['onLoad']>;

export const useImage = (
  ref: RefObject<HTMLImageElement | null>,
  props: Pick<ImageProps, 'height' | 'width'>,
) => {
  const { width = 0, height = 0 } = props;

  const [state, dispatch] = useReducer(imageReducer, {
    // If only one of width or height are passed in, set them equal
    width,
    height,
    status: 'pending',
  });

  const onLoad = useCallback<ImgOnLoad>(event => {
    dispatch({
      type: 'SUCCEEDED',
      payload: {
        height: event.currentTarget.height,
        width: event.currentTarget.width,
      },
    });
  }, []);

  const onError = useCallback(() => {
    dispatch({ type: 'FAILED' });
  }, []);

  useEffect(() => {
    if (state.status === 'pending' && ref.current?.complete) {
      dispatch({
        type: 'SUCCEEDED',
        payload: {
          height: ref.current.height,
          width: ref.current.width,
        },
      });
    }
  }, [ref, state.status]);

  const useImageProps = useMemo(
    () => ({
      status: state.status,
      height: state.height,
      width: state.width,
      onLoad,
      onError,
    }),
    [state.status, state.height, state.width, onLoad, onError],
  );

  return useImageProps;
};
