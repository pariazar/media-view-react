import React, { useMemo, useRef } from 'react';
import type { DataType, MediaProviderBase } from './types';
import useMethods from './hooks/useMethods';
import useSetState from './hooks/useSetState';
import MediaContext from './media-context';
import MediaSlider from './MediaSlider';
export interface MediaProviderProps extends MediaProviderBase {
  children: React.ReactNode;
  onIndexChange?: (index: number, state: MediaProviderState) => void;
  onVisibleChange?: (visible: boolean, index: number, state: MediaProviderState) => void;
  onVideoIndexChange?: (index: number, state: MediaProviderState) => void;
  onVideoVisibleChange?: (visible: boolean, index: number, state: MediaProviderState) => void;
}
type MediaProviderState = {
  images: DataType[];
  videos: DataType[];
  visible: boolean;
  index: number;
  videoIndex: number;
};
const initialState: MediaProviderState = {
  images: [],
  videos: [],
  visible: false,
  index: 0,
  videoIndex: 0,
};
export default function MediaProvider({ children, onIndexChange, onVisibleChange, ...restProps }: MediaProviderProps) {
  const [state, updateState] = useSetState(initialState);
  const uniqueIdRef = useRef(0);
  const { images, visible, index } = state;
  const methods = useMethods({
    nextId() {
      return (uniqueIdRef.current += 1);
    },
    update(imageItem: DataType) {
      const currentIndex = images.findIndex((n) => n.key === imageItem.key);
      if (currentIndex > -1) {
        const nextImages = images.slice();
        nextImages.splice(currentIndex, 1, imageItem);
        updateState({
          images: nextImages,
        });
        return;
      }
      updateState((prev) => ({
        images: prev.images.concat(imageItem),
      }));
    },
    remove(key: number) {
      updateState((prev) => {
        const nextImages = prev.images.filter((item) => item.key !== key);
        const nextEndIndex = nextImages.length - 1;
        return {
          images: nextImages,
          index: Math.min(nextEndIndex, index),
        };
      });
    },
    show(key: number) {
      const currentIndex = images.findIndex((item) => item.key === key);
      updateState({
        visible: true,
        index: currentIndex,
      });
      if (onVisibleChange) {
        onVisibleChange(true, currentIndex, state);
      }
    },
  });
  const fn = useMethods({
    close() {
      updateState({
        visible: false,
      });
      if (onVisibleChange) {
        onVisibleChange(false, index, state);
      }
    },
    changeIndex(nextIndex: number) {
      updateState({
        index: nextIndex,
      });
      if (onIndexChange) {
        onIndexChange(nextIndex, state);
      }
    },
  });
  const value = useMemo(() => ({ ...state, ...methods }), [state, methods]);
  return (
    <MediaContext.Provider value={value}>
      {children}
      <MediaSlider
        images={images}
        visible={visible}
        index={index}
        onIndexChange={fn.changeIndex}
        onClose={fn.close}
        {...restProps}
      />
    </MediaContext.Provider>
  );
}
