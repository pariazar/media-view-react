import { useReducer, useRef } from 'react';
import type { ActiveAnimationType } from '../types';
import useForkedVariable from './useForkedVariable';
export default function useAnimationVisible(
  visible: boolean | undefined,
  afterClose?: () => void,
): [realVisible: boolean | undefined, activeAnimation: ActiveAnimationType, onAnimationEnd: () => void] {
  const [, handleRender] = useReducer((c) => !c, false);
  const activeAnimation = useRef<ActiveAnimationType>(0);
  const [realVisible, modifyRealVisible] = useForkedVariable(visible, (modify) => {
    if (visible) {
      modify(visible);
      activeAnimation.current = 1;
    } else {
      activeAnimation.current = 2;
    }
  });
  function onAnimationEnd() {
    handleRender();
    if (activeAnimation.current === 2) {
      modifyRealVisible(false);
      if (afterClose) {
        afterClose();
      }
    }
    activeAnimation.current = 0;
  }
  return [
    realVisible,
    activeAnimation.current,
    onAnimationEnd,
  ];
}
