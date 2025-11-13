import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useMemo, useState } from 'react';

export const PresetCarouselId = {
  Miniplayer: 'miniplayer',
  ProfilePlayer: 'profile-player',
  Home: 'home',
} as const;

export type PresetCarouselId =
  (typeof PresetCarouselId)[keyof typeof PresetCarouselId];

type IsEditing = PresetCarouselId | null;

export const PresetsDrawerContext = createContext<{
  isOpen: boolean;
  setIsOpen: ((value: boolean) => void) | (() => null);
  isEditing: IsEditing;
  setIsEditing: Dispatch<SetStateAction<IsEditing>> | (() => null);
}>({
  isOpen: false,
  setIsOpen: () => null,
  isEditing: null,
  setIsEditing: () => null,
});

export const PresetsDrawerProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // Manages if the Drawer that holds Presets is open or not
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Only one instance of the Presets Carousel can be in "Edit Mode" at once.
   * This state manages if any of the three Presets carousels are in Edit Mode.
   *
   * Each implementation of the <PresetsCarousel /> passes in a `type` prop.
   * At the Carousel level, it compares the `type` to the carousel you're interacting with.
   * The result is that when clicking the Edit pencil icon in one carousel, only that carousel will enter edit mode.
   * */
  const [isEditing, setIsEditing] = useState<IsEditing>(null);

  const contextValue = useMemo(
    () => ({
      isOpen,
      setIsOpen: (value: boolean) => {
        // Whenever `setIsOpen` is called, we want to remove all carousels from Edit Mode
        setIsEditing(null);
        setIsOpen(value);
      },
      isEditing,
      setIsEditing,
    }),
    [isOpen, setIsOpen, isEditing, setIsEditing],
  );

  return (
    <PresetsDrawerContext.Provider value={contextValue}>
      {children}
    </PresetsDrawerContext.Provider>
  );
};
