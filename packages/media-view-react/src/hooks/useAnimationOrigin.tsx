import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { useState, useEffect, useRef } from 'react';
import type { EasingMode, OriginRectType } from '../types';
import useMethods from './useMethods';
import { maxWaitAnimationTime } from '../variables';
const initialRect: OriginRectType = {
  T: 0,
  L: 0,
  W: 0,
  H: 0,
  FIT: undefined,
};
export default function useAnimationOrigin(
  visible: boolean | undefined,
  originRef: MutableRefObject<HTMLElement | null> | undefined,
  loaded: boolean,
  speed: number,
  updateEasing: (pause: boolean) => void,
): [
  easingMode: EasingMode,
  originRect: OriginRectType,
] {
  const [originRect, updateOriginRect] = useState(initialRect);
  const [easingMode, updateEasingMode] = useState<EasingMode>(0);
  const initialTime = useRef<number>();
  const fn = useMethods({
    OK: () => visible && updateEasingMode(4),
  });
  useEffect(() => {
    if (!initialTime.current) {
      initialTime.current = Date.now();
    }
    if (!loaded) {
      return;
    }
    handleUpdateOrigin(originRef, updateOriginRect);
    if (visible) {
      if (Date.now() - initialTime.current < maxWaitAnimationTime) {
        updateEasingMode(1);
        requestAnimationFrame(() => {
          updateEasingMode(2);
          requestAnimationFrame(() => handleToShape(3));
        });
        setTimeout(fn.OK, speed);
        return;
      }
      updateEasingMode(4);
      return;
    }
    handleToShape(5);
  }, [visible, loaded]);
  function handleToShape(currentShape: EasingMode) {
    updateEasing(false);
    updateEasingMode(currentShape);
  }
  return [easingMode, originRect];
}
function handleUpdateOrigin(
  originRef: MutableRefObject<HTMLElement | null> | undefined,
  updateOriginRect: Dispatch<SetStateAction<typeof initialRect>>,
) {
  const element = originRef && originRef.current;
  if (element && element.nodeType === 1) {
    const { top, left, width, height } = element.getBoundingClientRect();
    const isImage = element.tagName === 'IMG';
    updateOriginRect({
      T: top,
      L: left,
      W: width,
      H: height,
      FIT: isImage ? (getComputedStyle(element).objectFit as 'contain' | 'cover' | 'fill' | undefined) : undefined,
    });
  }
}
