import React, { useRef } from 'react';
import isTouchDevice from './utils/isTouchDevice';
import getMultipleTouchPosition from './utils/getMultipleTouchPosition';
import getPositionOnMoveOrScale from './utils/getPositionOnMoveOrScale';
import { getReachType, computePositionEdge } from './utils/edgeHandle';
import getRotateSize from './utils/getRotateSize';
import { limitScale } from './utils/limitTarget';
import getSuitableImageSize from './utils/getSuitableImageSize';
import useIsomorphicLayoutEffect from './hooks/useIsomorphicLayoutEffect';
import { minStartTouchOffset, scaleBuffer } from './variables';
import type {
  DataType,
  ReachMoveFunction,
  ReachFunction,
  PhotoTapFunction,
  BrokenElementParams,
  ExposedProperties,
} from './types';
import type { ReachType, TouchStartType } from './types';
import useSetState from './hooks/useSetState';
import useMethods from './hooks/useMethods';
import useDebounceCallback from './hooks/useDebounceCallback';
import useEventListener from './hooks/useEventListener';
import useContinuousTap from './hooks/useContinuousTap';
import useScrollPosition from './hooks/useScrollPosition';
import useAnimationPosition from './hooks/useAnimationPosition';
import useMountedRef from './hooks/useMountedRef';
import type { IPhotoLoadedParams } from './Photo';
import Photo from './Photo';
import './PhotoBox.less';
export interface PhotoBoxProps {
  item: DataType;
  visible: boolean;
  speed: number;
  easing: string;
  wrapClassName?: string;
  className?: string;
  style?: object;
  loadingElement?: JSX.Element;
  brokenElement?: JSX.Element | ((photoProps: BrokenElementParams) => JSX.Element);
  onPhotoTap: PhotoTapFunction;
  onMaskTap: PhotoTapFunction;
  onReachMove: ReachMoveFunction;
  onReachUp: ReachFunction;
  onPhotoResize: () => void;
  expose: (state: ExposedProperties) => void;
  isActive: boolean;
}
const initialState = {
  naturalWidth: undefined as number | undefined,
  naturalHeight: undefined as number | undefined,
  width: undefined as number | undefined,
  height: undefined as number | undefined,
  loaded: undefined as boolean | undefined,
  broken: false,
  x: 0,
  y: 0,
  touched: false,
  maskTouched: false,
  rotate: 0,
  scale: 1,
  CX: 0,
  CY: 0,
  lastX: 0,
  lastY: 0,
  lastCX: 0,
  lastCY: 0,
  lastScale: 1,
  touchTime: 0,
  touchLength: 0,
  pause: true,
  stopRaf: true,
  reach: undefined as ReachType,
};
export default function PhotoBox({
  item: { src, render, width: customWidth = 0, height: customHeight = 0, originRef },
  visible,
  speed,
  easing,
  wrapClassName,
  className,
  style,
  loadingElement,
  brokenElement,
  onPhotoTap,
  onMaskTap,
  onReachMove,
  onReachUp,
  onPhotoResize,
  isActive,
  expose,
}: PhotoBoxProps) {
  const [state, updateState] = useSetState(initialState);
  const initialTouchRef = useRef<TouchStartType>(0);
  const mounted = useMountedRef();
  const {
    naturalWidth = customWidth,
    naturalHeight = customHeight,
    width = customWidth,
    height = customHeight,
    loaded = !src,
    broken,
    x,
    y,
    touched,
    stopRaf,
    maskTouched,
    rotate,
    scale,
    CX,
    CY,
    lastX,
    lastY,
    lastCX,
    lastCY,
    lastScale,
    touchTime,
    touchLength,
    pause,
    reach,
  } = state;
  const fn = useMethods({
    onScale: (current: number) => onScale(limitScale(current)),
    onRotate(current: number) {
      if (rotate !== current) {
        expose({ rotate: current });
        updateState({ rotate: current, ...getSuitableImageSize(naturalWidth, naturalHeight, current) });
      }
    },
  });
  function onScale(current: number, clientX?: number, clientY?: number) {
    if (scale !== current) {
      expose({ scale: current });
      updateState({
        scale: current,
        ...getPositionOnMoveOrScale(x, y, width, height, scale, current, clientX, clientY),
        ...(current <= 1 && { x: 0, y: 0 }),
      });
    }
  }
  const handleMove = useDebounceCallback(
    (nextClientX: number, nextClientY: number, currentTouchLength: number = 0) => {
      if ((touched || maskTouched) && isActive) {
        const [currentWidth, currentHeight] = getRotateSize(rotate, width, height);
        if (currentTouchLength === 0 && initialTouchRef.current === 0) {
          const isStillX = Math.abs(nextClientX - CX) <= minStartTouchOffset;
          const isStillY = Math.abs(nextClientY - CY) <= minStartTouchOffset;
          if (isStillX && isStillY) {
            updateState({ lastCX: nextClientX, lastCY: nextClientY });
            return;
          }
          initialTouchRef.current = !isStillX ? 1 : nextClientY > CY ? 3 : 2;
        }
        const offsetX = nextClientX - lastCX;
        const offsetY = nextClientY - lastCY;
        let currentReach: ReachType = undefined;
        if (currentTouchLength === 0) {
          const [horizontalCloseEdge] = computePositionEdge(offsetX + lastX, scale, currentWidth, innerWidth);
          const [verticalCloseEdge] = computePositionEdge(offsetY + lastY, scale, currentHeight, innerHeight);
          currentReach = getReachType(initialTouchRef.current, horizontalCloseEdge, verticalCloseEdge, reach);
          if (currentReach !== undefined) {
            onReachMove(currentReach, nextClientX, nextClientY, scale);
          }
        }
        if (currentReach === 'x' || maskTouched) {
          updateState({ reach: 'x' });
          return;
        }
        const toScale = limitScale(
          scale + ((currentTouchLength - touchLength) / 100 / 2) * scale,
          naturalWidth / width,
          scaleBuffer,
        );
        expose({ scale: toScale });
        updateState({
          touchLength: currentTouchLength,
          reach: currentReach,
          scale: toScale,
          ...getPositionOnMoveOrScale(x, y, width, height, scale, toScale, nextClientX, nextClientY, offsetX, offsetY),
        });
      }
    },
    {
      maxWait: 8,
    },
  );
  function updateRaf(position: { x?: number; y?: number }) {
    if (stopRaf || touched) {
      return false;
    }
    if (mounted.current) {
      updateState({ ...position, pause: visible });
    }
    return mounted.current;
  }
  const slideToPosition = useScrollPosition(
    (nextX) => updateRaf({ x: nextX }),
    (nextY) => updateRaf({ y: nextY }),
    (nextScale) => {
      if (mounted.current) {
        expose({ scale: nextScale });
        updateState({ scale: nextScale });
      }
      return !touched && mounted.current;
    },
  );
  const handlePhotoTap = useContinuousTap(onPhotoTap, (currentClientX: number, currentClientY: number) => {
    if (!reach) {
      const endScale = scale !== 1 ? 1 : Math.max(2, naturalWidth / width);
      onScale(endScale, currentClientX, currentClientY);
    }
  });
  function handleUp(nextClientX: number, nextClientY: number) {
    initialTouchRef.current = 0;
    if ((touched || maskTouched) && isActive) {
      updateState({
        touched: false,
        maskTouched: false,
        pause: false,
        stopRaf: false,
        reach: undefined,
      });
      const safeScale = limitScale(scale, naturalWidth / width);
      slideToPosition(x, y, lastX, lastY, width, height, scale, safeScale, lastScale, rotate, touchTime);
      onReachUp(nextClientX, nextClientY);
      if (CX === nextClientX && CY === nextClientY) {
        if (touched) {
          handlePhotoTap(nextClientX, nextClientY);
          return;
        }
        if (maskTouched) {
          onMaskTap(nextClientX, nextClientY);
        }
      }
    }
  }
  useEventListener(isTouchDevice ? undefined : 'mousemove', (e) => {
    e.preventDefault();
    handleMove(e.clientX, e.clientY);
  });
  useEventListener(isTouchDevice ? undefined : 'mouseup', (e) => {
    handleUp(e.clientX, e.clientY);
  });
  useEventListener(
    isTouchDevice ? 'touchmove' : undefined,
    (e) => {
      e.preventDefault();
      const position = getMultipleTouchPosition(e);
      handleMove(...position);
    },
    { passive: false },
  );
  useEventListener(
    isTouchDevice ? 'touchend' : undefined,
    ({ changedTouches }) => {
      const touch = changedTouches[0];
      handleUp(touch.clientX, touch.clientY);
    },
    { passive: false },
  );
  useEventListener(
    'resize',
    useDebounceCallback(
      () => {
        if (loaded && !touched) {
          updateState(getSuitableImageSize(naturalWidth, naturalHeight, rotate));
          onPhotoResize();
        }
      },
      { maxWait: 8 },
    ),
  );
  useIsomorphicLayoutEffect(() => {
    if (isActive) {
      expose({ scale, rotate, ...fn });
    }
  }, [isActive]);
  function handlePhotoLoad(params: IPhotoLoadedParams) {
    updateState({
      ...params,
      ...(params.loaded && getSuitableImageSize(params.naturalWidth || 0, params.naturalHeight || 0, rotate)),
    });
  }
  function handleStart(currentClientX: number, currentClientY: number, currentTouchLength: number = 0) {
    updateState({
      touched: true,
      CX: currentClientX,
      CY: currentClientY,
      lastCX: currentClientX,
      lastCY: currentClientY,
      lastX: x,
      lastY: y,
      lastScale: scale,
      touchLength: currentTouchLength,
      touchTime: Date.now(),
    });
  }
  function handleWheel(e: React.WheelEvent) {
    if (!reach) {
      const toScale = limitScale(scale - e.deltaY / 100 / 2, naturalWidth / width);
      updateState({ stopRaf: true });
      onScale(toScale, e.clientX, e.clientY);
    }
  }
  function handleMaskStart(e: { clientX: number; clientY: number }) {
    updateState({
      maskTouched: true,
      CX: e.clientX,
      CY: e.clientY,
      lastX: x,
      lastY: y,
    });
  }
  function handleTouchStart(e: React.TouchEvent) {
    e.stopPropagation();
    handleStart(...getMultipleTouchPosition(e));
  }
  function handleMouseDown(e: React.MouseEvent) {
    e.stopPropagation();
    if (e.button === 0) {
      handleStart(e.clientX, e.clientY, 0);
    }
  }
  const [translateX, translateY, currentWidth, currentHeight, currentScale, opacity, easingMode, FIT] =
    useAnimationPosition(visible, originRef, loaded, x, y, width, height, scale, speed, (isPause: boolean) =>
      updateState({ pause: isPause }),
    );
  const transitionLayoutTime = easingMode < 4 ? speed / 2 : easingMode > 4 ? speed : 0;
  const transitionCSS = `transform ${speed}ms ${easing}`;
  const attrs = {
    className,
    onMouseDown: isTouchDevice ? undefined : handleMouseDown,
    onTouchStart: isTouchDevice ? handleTouchStart : undefined,
    onWheel: handleWheel,
    style: {
      width: currentWidth,
      height: currentHeight,
      opacity,
      objectFit: easingMode === 4 ? undefined : FIT,
      transform: rotate ? `rotate(${rotate}deg)` : undefined,
      transition:
        easingMode > 2
          ? `${transitionCSS}, opacity ${speed}ms ease, height ${transitionLayoutTime}ms ${easing}`
          : undefined,
    },
  };
  return (
    <div
      className={`MediaView__PhotoWrap${wrapClassName ? ` ${wrapClassName}` : ''}`}
      style={style}
      onMouseDown={!isTouchDevice && isActive ? handleMaskStart : undefined}
      onTouchStart={isTouchDevice && isActive ? (e) => handleMaskStart(e.touches[0]) : undefined}
    >
      <div
        className="MediaView__PhotoBox"
        style={{
          transform: `matrix(${currentScale}, 0, 0, ${currentScale}, ${translateX}, ${translateY})`,
          transition: touched || pause ? undefined : transitionCSS,
          willChange: isActive ? 'transform' : undefined,
        }}
      >
        {src ? (
          <Photo
            src={src}
            loaded={loaded}
            broken={broken}
            {...attrs}
            onPhotoLoad={handlePhotoLoad}
            loadingElement={loadingElement}
            brokenElement={brokenElement}
          />
        ) : (
          render && render({ attrs, scale: currentScale, rotate })
        )}
      </div>
    </div>
  );
}
