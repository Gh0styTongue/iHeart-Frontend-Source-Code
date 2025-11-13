import { PressResponder } from '@react-aria/interactions';
import type { ReactElement, ReactNode, RefObject } from 'react';
import {
  cloneElement,
  createContext,
  forwardRef,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { AriaDialogProps, HoverProps, Key } from 'react-aria';
import { useDialog, useHover } from 'react-aria';
import {
  type DialogTriggerProps,
  Button as RACButton,
  DialogContext,
  DropIndicator,
  useContextProps,
  useDragAndDrop,
} from 'react-aria-components';
import { Heading } from 'react-aria-components';
import { createPortal } from 'react-dom';
import type { ListData } from 'react-stately';
import { isFunction } from 'remeda';

import { Button } from '../../components/button/button.js';
import { MinusFilledWhite } from '../../icons/minus-filled-white.js';
import { Pencil } from '../../icons/pencil.js';
import { Plus } from '../../icons/plus.js';
import { Preset } from '../../icons/preset.js';
import { lightDark } from '../../media.js';
import { sprinkles } from '../../sprinkles.css.js';
import { vars } from '../../theme-contract.css.js';
import { Box } from '../box/box.js';
import {
  type CarouselContentProps,
  Carousel,
  CarouselContent,
  CarouselHandler,
  CarouselSlide,
} from '../carousel/carousel.js';
import { type DialogClose, Dialog, DialogTrigger } from '../dialog/dialog.js';
import { Flex } from '../flex/flex.js';
import { Group } from '../group/group.js';
import { Spacer } from '../spacer/spacer.js';
import { Stack } from '../stack/stack.js';
import { Text } from '../text/text.js';
import {
  backgroundStyles,
  baseBackgroundStyles,
  baseCardStyles,
  cardContainerStyles,
  deleteIconContainerStyles,
  deleteIconStyles,
  drawerContainerStyles,
  drawerContentRecipe,
  dropIndicatorStyles,
  headingStyles,
  imageStyles,
  overlayStyles,
  paddedContainerRecipe,
  placeholderCardContainerStyles,
  placeholderCardStyles,
  placeholderIconStyles,
  placeholderPaddedContainerStyles,
} from './preset-list.css.js';

const SMALL_GAP = vars.space[6];
const LARGE_GAP = vars.space[12];

const presetCarouselSlideGap = {
  xsmall: SMALL_GAP,
  small: SMALL_GAP,
  shmedium: SMALL_GAP,
  medium: LARGE_GAP,
  large: LARGE_GAP,
  xlarge: LARGE_GAP,
  xxlarge: LARGE_GAP,
} as const;

export type PresetCardProps<T> = HoverProps & {
  src: string;
  type: string;
  title: string;
  position: T;
  onDeleteAction?: ({
    title,
    position,
  }: {
    title: string;
    position: T;
  }) => void;
  onModalOpen?: () => void;
  onModalCancel?: () => void;
};

export type PresetCardSlideProps<T> = PresetCardProps<T> & {
  onAction?: () => void;
};

export function PresetCard<T>({
  onDeleteAction,
  onModalCancel,
  onModalOpen,
  position,
  src,
  title,
  type,
  ...props
}: PresetCardProps<T>) {
  const { isHovered, hoverProps } = useHover(props);
  const isArtist = type === 'ARTIST';

  return (
    <div
      className={cardContainerStyles}
      data-hovered={isHovered || undefined}
      data-test="preset-card"
      {...hoverProps}
      {...props}
    >
      {/* Background div that displays the hover effect */}
      <div className={backgroundStyles} />
      {/* Padded container that provides space for background hover effect to display */}
      <div className={paddedContainerRecipe({ isArtist })}>
        {/* Opacity overlay when hovering over the image only */}
        <div className={overlayStyles} />
        {/* Image container */}
        <div className={baseCardStyles}>
          {/* TODO: There are currently issues with the <Image /> component, when they are resolved the `img` should swapped to `Image`  */}
          <img alt="preset-card-artwork" className={imageStyles} src={src} />
        </div>
      </div>
      {/* Delete icon displayed when card is in edit mode */}
      <DialogTrigger
        isDismissable
        onOpenChange={open => open && onModalOpen?.()}
      >
        <RACButton className={deleteIconContainerStyles}>
          <MinusFilledWhite className={deleteIconStyles} />
        </RACButton>
        {close => (
          <Dialog>
            <Stack align="center" gap={vars.space[16]}>
              <Text
                color={lightDark(vars.color.gray600, vars.color.brandWhite)}
                kind="h5"
              >
                Remove Preset
              </Text>
              <Text
                color={lightDark(vars.color.gray600, vars.color.brandWhite)}
                kind="body-3"
              >
                Are you sure you want to remove this preset?
              </Text>
              <Group gap={vars.space[16]} justify="center">
                <Button
                  color="gray"
                  kind="secondary"
                  onPress={() => {
                    close();
                    onModalCancel?.();
                  }}
                  size="small"
                >
                  Cancel
                </Button>
                <Button
                  color="red"
                  kind="primary"
                  onPress={() => {
                    onDeleteAction?.({ title, position });
                    close();
                  }}
                  size="small"
                >
                  Remove
                </Button>
              </Group>
            </Stack>
          </Dialog>
        )}
      </DialogTrigger>
      <RACButton slot="drag" style={{ display: 'none' }} />
    </div>
  );
}

export function PresetPlaceholder({ ...props }: HoverProps) {
  const { isHovered, hoverProps } = useHover(props);

  return (
    <div
      className={placeholderCardContainerStyles}
      data-hovered={isHovered || undefined}
      data-test="preset-placeholder"
      role="gridcell"
      {...hoverProps}
      {...props}
    >
      {/* Background div that displays the hover effect */}
      <div className={baseBackgroundStyles} />
      {/* Padded container that provides space for background hover effect to display */}
      <div className={placeholderPaddedContainerStyles}>
        {/* Opacity overlay when hovering over the image only */}
        <div className={overlayStyles} />
        {/* Card container */}
        <div className={placeholderCardStyles}>
          <div
            className={sprinkles({
              color: {
                lightMode: 'gray500',
                darkMode: 'gray200',
              },
            })}
          >
            <Plus className={placeholderIconStyles} />
          </div>
        </div>
      </div>
      <RACButton slot="drag" style={{ display: 'none' }} />
    </div>
  );
}

export function PresetCardSlide<T>({
  onAction,
  onDeleteAction,
  onModalCancel,
  onModalOpen,
  src,
  type,
  title,
  position,
  ...props
}: PresetCardSlideProps<T>) {
  const isEditing = usePresetListState();

  return (
    <CarouselSlide onAction={() => !isEditing && onAction?.()} {...props}>
      <PresetCard
        onDeleteAction={onDeleteAction}
        onModalCancel={onModalCancel}
        onModalOpen={onModalOpen}
        position={position}
        src={src}
        title={title}
        type={type}
      />
    </CarouselSlide>
  );
}

export function PresetPlaceholderSlide({
  onAction,
  ...props
}: {
  onAction?: () => void;
  ref?: RefObject<HTMLDivElement | null> | null;
}) {
  const isEditing = usePresetListState();

  return (
    <CarouselSlide isDisabled={isEditing} onAction={onAction} {...props}>
      <PresetPlaceholder />
    </CarouselSlide>
  );
}

export const PresetListStateContext = createContext<boolean | null>(null);

export const usePresetListState = () => {
  const isEditing = useContext(PresetListStateContext);

  if (isEditing === null) {
    throw new Error('usePresetListState must be used within the provider.');
  }

  return isEditing;
};

export type PresetListProps<T extends object> = {
  children: (item: T) => ReactNode;
  dependencies?: CarouselContentProps<T>['dependencies'];
  isEditing: boolean;
  onEdit: () => void | null;
  onMove: ({
    presetData,
    movedId,
    newPosition,
    oldPosition,
  }: {
    presetData: ListData<T>;
    movedId: Key;
    newPosition: Key;
    oldPosition: Key;
  }) => void;
  isInDrawer?: boolean;
  isAnonymous?: boolean;
  presetData: ListData<T>;
};
export function PresetList<
  T extends { id: Key; imageUrl?: string; type?: string },
>({
  children,
  dependencies,
  isEditing,
  onEdit,
  onMove,
  isAnonymous = true,
  isInDrawer = false,
  presetData,
}: PresetListProps<T>) {
  // This state helps keep track of which item you are dragging, by storing the item's index/position in the carousel
  const [draggingItemPosition, setDraggingItemPosition] = useState<
    number | null
  >(null);

  const presetDataLength = useMemo(
    () => presetData.items.filter(preset => preset.imageUrl).length,
    [presetData.items],
  );

  const { dragAndDropHooks } = useDragAndDrop({
    getItems(keys) {
      return [...keys].map(key => ({
        'text/plain': String(key),
      }));
    },

    // This method is called when you drop an item - i.e. when you release your mouse button after dragging one
    onDrop(e) {
      if (draggingItemPosition !== null && e.target.type !== 'root') {
        const draggingItemKey = presetData.items[draggingItemPosition].id;
        const droppedItemKey = e.target.key;
        const droppedItemPosition = presetData.items.findIndex(
          item => item.id === droppedItemKey,
        );

        // These methods do not directly update `presetData`, they just update the placement of the cards in the UI
        // The actual updating of `presetData` is handled in `onMove()` below
        if (e.target.dropPosition === 'before') {
          presetData.moveBefore(droppedItemKey, [draggingItemKey]);
        } else if (e.target.dropPosition === 'after') {
          presetData.moveAfter(droppedItemKey, [draggingItemKey]);
        }

        // Currently we do not support dropping "on" a placeholder tile, only in-between
        // This functionality could be supported in the future after a refactor, but the current iteration can not support this.
        if (e.target.dropPosition !== 'on') {
          /**
           * There is an issue with `useDragAndDrop` where if you are moving an item to a further spot, **before** an item, then it doesn't account for
           * the layout shift of removing it from its current position. This only occurs if the new position is numerically greater than its current position.
           *
           * Ex: Moving a preset from index 1 to index 7, it thinks you are dropping at index 7. This is incorrect as the current preset is being REMOVED from index 1.
           * In this scenario, we remove "1" from the insertion index to account for the index shifting.
           */
          const newPosition =
            (
              e.target.dropPosition === 'before' &&
              droppedItemPosition > draggingItemPosition
            ) ?
              Number(droppedItemPosition) - 1
            : Number(droppedItemPosition);

          onMove({
            presetData,
            movedId: draggingItemKey,
            newPosition,
            oldPosition: draggingItemPosition,
          });
        }

        // Clear state for `draggingItemPosition` after we finish dragging the item
        setDraggingItemPosition(null);
      }
    },

    // This method is called once you begin dragging an item
    onDragStart(e) {
      const draggedItemKey = e.keys.keys().next().value;
      const draggedItemPosition = presetData.items.findIndex(
        item => item.id === draggedItemKey,
      );

      // Save the item's index/position to state
      setDraggingItemPosition(draggedItemPosition);
    },

    // This renders the vertical line between cards while you are dragging an item
    renderDropIndicator(target) {
      return <DropIndicator className={dropIndicatorStyles} target={target} />;
    },
  });

  const isDisabled = isAnonymous || (presetDataLength <= 0 && !isEditing);

  return (
    <PresetListStateContext.Provider value={isEditing}>
      <Carousel
        data-editing={isEditing || undefined}
        data-test="presets-carousel"
        isEditingCarousel={isEditing}
        key={JSON.stringify(presetData)}
        skipSnaps={false}
        slideGap={presetCarouselSlideGap}
        slidesToShow={{
          xsmall: 5,
          small: 5,
          medium: 8,
          large: isInDrawer ? 10 : 8,
          xlarge: isInDrawer ? 12 : 10,
        }}
      >
        <CarouselHandler>
          <Flex alignItems="center">
            <Flex color={lightDark(vars.color.gray600, vars.color.brandWhite)}>
              <Preset />
            </Flex>
            <Spacer left={vars.space[4]} right={vars.space[16]}>
              <Text
                as="p"
                color={lightDark(vars.color.gray600, vars.color.brandWhite)}
                kind={{ mobile: 'h4', large: 'h3' }}
              >
                Presets
              </Text>
            </Spacer>
            <Flex width="100%">
              <button
                disabled={isDisabled}
                onClick={onEdit}
                style={{ cursor: isAnonymous ? 'default' : 'pointer' }}
              >
                {isEditing ?
                  <Text
                    as="p"
                    color={lightDark(vars.color.blue600, vars.color.blue400)}
                    kind="button-2"
                  >
                    Done
                  </Text>
                : <Box
                    color={
                      isDisabled ?
                        lightDark(vars.color.gray300, vars.color.gray400)
                      : lightDark(vars.color.gray600, vars.color.brandWhite)
                    }
                    cursor={isDisabled ? 'auto' : 'pointer'}
                  >
                    <Pencil />
                  </Box>
                }
              </button>
            </Flex>
          </Flex>
        </CarouselHandler>
        <CarouselContent<T>
          dependencies={dependencies}
          dragAndDropHooks={dragAndDropHooks}
          items={presetData.items}
        >
          {children}
        </CarouselContent>
      </Carousel>
    </PresetListStateContext.Provider>
  );
}

export function DrawerHeading({
  children,
  close,
}: {
  children?: ReactNode;
  close: () => void;
}) {
  return (
    <Heading className={headingStyles} slot="title">
      {children}

      <button onClick={close} style={{ cursor: 'pointer' }}>
        <Text
          as="p"
          color={lightDark(vars.color.blue600, vars.color.blue400)}
          kind="button-2"
        >
          Dismiss
        </Text>
      </button>
    </Heading>
  );
}

interface PresetsDrawerTriggerProps extends DialogTriggerProps {
  portalContainer?: Element | DocumentFragment;
  setIsOpen: ((value: boolean) => void) | (() => null);
}

export function PresetsDrawerTrigger({
  children,
  portalContainer,
  isOpen,
  setIsOpen,
  ...props
}: PresetsDrawerTriggerProps) {
  if (!Array.isArray(children) || children.length > 2) {
    throw new Error('DialogTrigger must have exactly 2 children');
  }

  const ref = useRef(null);

  // If a function is passed as the second child, it won't appear in toArray
  const [trigger, content] = children as [ReactElement, DialogClose];

  const drawerContent = (
    <div className={drawerContainerStyles} data-open={isOpen}>
      <DrawerHeading close={() => setIsOpen(false)} />
      {cloneElement(
        isFunction(content) ? content(() => setIsOpen(false)) : content,
        props,
      )}
    </div>
  );

  return (
    <>
      {/* 
      When drawer is opened, render it in a portal. 
      The portal ensures it is rendered within the content section of the app only, this prevents it from rendering over the miniplayer, navigation, etc.
    */}
      <PressResponder {...props} isPressed={isOpen} ref={ref}>
        {cloneElement(trigger, props)}
      </PressResponder>
      {portalContainer ?
        createPortal(drawerContent, portalContainer)
      : drawerContent}
    </>
  );
}
export interface DialogProps extends AriaDialogProps {
  className?: string;
  children?: ReactNode;
  isInProfilePlayer?: boolean;
}
export const PresetsDrawerContent = forwardRef<HTMLElement, DialogProps>(
  function Dialog(props, ref) {
    [props, ref] = useContextProps(props, ref, DialogContext);
    const { children, isInProfilePlayer } = props;
    const { dialogProps } = useDialog(props, ref);

    return (
      <section
        {...dialogProps}
        className={drawerContentRecipe({ isInProfilePlayer })}
        ref={ref}
      >
        {children}
      </section>
    );
  },
);
