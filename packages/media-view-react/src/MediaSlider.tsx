import React, { useRef, useState } from 'react';
import type { DataType, MediaProviderBase, OverlayRenderProps } from './types';
import type { ReachType } from './types';
import { defaultEasing, defaultSpeed, defaultOpacity, horizontalOffset, maxMoveOffset } from './variables';
import isTouchDevice from './utils/isTouchDevice';
import { limitNumber } from './utils/limitTarget';
import useIsomorphicLayoutEffect from './hooks/useIsomorphicLayoutEffect';
import useAdjacentImages from './hooks/useAdjacentImages';
import useSetState from './hooks/useSetState';
import useEventListener from './hooks/useEventListener';
import useAnimationVisible from './hooks/useAnimationVisible';
import useMethods from './hooks/useMethods';
import SlidePortal from './components/SlidePortal';
import CloseIcon from './components/CloseIcon';
import ArrowLeft from './components/ArrowLeft';
import ArrowRight from './components/ArrowRight';
import PreventScroll from './components/PreventScroll';
import PhotoBox from './PhotoBox';
import VideoBox from './VideoBox';
import './MediaSlider.less';
export interface IMediaSliderProps extends MediaProviderBase {
  images: DataType[];
  index?: number;
  onIndexChange?: (index: number) => void;
  visible: boolean;
  onClose: (evt?: React.MouseEvent | React.TouchEvent) => void;
  afterClose?: () => void;
}
type MediaSliderState = {
  x: number;
  touched: boolean;
  pause: boolean;
  lastCX: number | undefined;
  lastCY: number | undefined;
  bg: number | null | undefined;
  lastBg: number | null | undefined;
  overlay: boolean;
  description: string;
  minimal: boolean;
  scale: number;
  rotate: number;
  onScale?: (scale: number) => void;
  onRotate?: (rotate: number) => void;
};
const initialState: MediaSliderState = {
  x: 0,
  touched: false,
  pause: false,
  lastCX: undefined,
  lastCY: undefined,
  bg: undefined,
  lastBg: undefined,
  overlay: true,
  description: 'this is perfect',
  minimal: true,
  scale: 1,
  rotate: 0,
};
export default function MediaSlider(props: IMediaSliderProps) {
  const {
    loop = 3,
    speed: speedFn,
    easing: easingFn,
    photoClosable,
    maskClosable = true,
    maskOpacity = defaultOpacity,
    pullClosable = true,
    bannerVisible = true,
    overlayRender,
    toolbarRender,
    className,
    maskClassName,
    photoClassName,
    photoWrapClassName,
    loadingElement,
    brokenElement,
    images,
    index: controlledIndex = 0,
    onIndexChange: controlledIndexChange,
    visible,
    onClose,
    afterClose,
    portalContainer,
  } = props;
  const [state, updateState] = useSetState(initialState);
  const [innerIndex, updateInnerIndex] = useState(0);
  const {
    x,
    touched,
    pause,
    lastCX,
    lastCY,
    bg = maskOpacity,
    lastBg,
    overlay,
    description,
    minimal,
    scale,
    rotate,
    onScale,
    onRotate,
  } = state;
  const isControlled = props.hasOwnProperty('index');
  const index = isControlled ? controlledIndex : innerIndex;
  const onIndexChange = isControlled ? controlledIndexChange : updateInnerIndex;
  const virtualIndexRef = useRef(index);
  const imageLength = images.length;
  const currentImage: DataType | undefined = images[index];
  const enableLoop = typeof loop === 'boolean' ? loop : imageLength > loop;
  const [realVisible, activeAnimation, onAnimationEnd] = useAnimationVisible(visible, afterClose);
  useIsomorphicLayoutEffect(() => {
    if (realVisible) {
      updateState({
        pause: true,
        x: index * -(innerWidth + horizontalOffset),
      });
      virtualIndexRef.current = index;
      return;
    }
    updateState(initialState);
  }, [realVisible]);
  const { close, changeIndex } = useMethods({
    close(evt?: React.MouseEvent | React.TouchEvent) {
      if (onRotate) {
        onRotate(0);
      }
      if(evt || currentImage.type === "image"){
        updateState({
          overlay: true,
          lastBg: bg,
        });
        onClose(evt);
      }
    },
    changeIndex(nextIndex: number, isPause: boolean = false) {
      const currentIndex = enableLoop ? virtualIndexRef.current + (nextIndex - index) : nextIndex;
      const max = imageLength - 1;
      const limitIndex = limitNumber(currentIndex, 0, max);
      const nextVirtualIndex = enableLoop ? currentIndex : limitIndex;
      const singlePageWidth = innerWidth + horizontalOffset;
      updateState({
        touched: false,
        lastCX: undefined,
        lastCY: undefined,
        x: -singlePageWidth * nextVirtualIndex,
        pause: isPause,
      });
      virtualIndexRef.current = nextVirtualIndex;
      const realLoopIndex = nextIndex < 0 ? max : nextIndex > max ? 0 : nextIndex;
      if (onIndexChange) {
        onIndexChange(enableLoop ? realLoopIndex : limitIndex);
      }
    },
  });
  useEventListener('keydown', (evt: KeyboardEvent) => {
    if (visible) {
      switch (evt.key) {
        case 'ArrowLeft':
          changeIndex(index - 1, true);
          break;
        case 'ArrowRight':
          changeIndex(index + 1, true);
          break;
        case 'Escape':
          close();
          break;
      }
    }
  });
  function handlePhotoTap(closeable: boolean | undefined) {
    return closeable ? close() : updateState({ overlay: !overlay });
  }
  function handleResize() {
    updateState({
      x: -(innerWidth + horizontalOffset) * index,
      lastCX: undefined,
      lastCY: undefined,
      pause: true,
    });
    virtualIndexRef.current = index;
  }
  function handleReachVerticalMove(clientY: number, nextScale?: number) {
    if (lastCY === undefined) {
      updateState({
        touched: true,
        lastCY: clientY,
        bg,
        minimal: true,
      });
      return;
    }
    const opacity =
      maskOpacity === null ? null : limitNumber(maskOpacity, 0.01, maskOpacity - Math.abs(clientY - lastCY) / 100 / 4);
    updateState({
      touched: true,
      lastCY,
      bg: nextScale === 1 ? opacity : maskOpacity,
      minimal: nextScale === 1,
    });
  }
  function handleReachHorizontalMove(clientX: number) {
    if (lastCX === undefined) {
      updateState({
        touched: true,
        lastCX: clientX,
        x,
        pause: false,
      });
      return;
    }
    const originOffsetClientX = clientX - lastCX;
    let offsetClientX = originOffsetClientX;
    if (
      !enableLoop &&
      ((index === 0 && originOffsetClientX > 0) || (index === imageLength - 1 && originOffsetClientX < 0))
    ) {
      offsetClientX = originOffsetClientX / 2;
    }
    updateState({
      touched: true,
      lastCX: lastCX,
      x: -(innerWidth + horizontalOffset) * virtualIndexRef.current + offsetClientX,
      pause: false,
    });
  }
  function handleReachMove(reachPosition: ReachType, clientX: number, clientY: number, nextScale?: number) {
    if (reachPosition === 'x') {
      handleReachHorizontalMove(clientX);
    } else if (reachPosition === 'y') {
      handleReachVerticalMove(clientY, nextScale);
    }
  }
  function handleReachUp(clientX: number, clientY: number) {
    const offsetClientX = clientX - (lastCX ?? clientX);
    const offsetClientY = clientY - (lastCY ?? clientY);
    let willClose = false;
    if (offsetClientX < -maxMoveOffset) {
      changeIndex(index + 1);
      return;
    }
    if (offsetClientX > maxMoveOffset) {
      changeIndex(index - 1);
      return;
    }
    const singlePageWidth = innerWidth + horizontalOffset;
    const currentTranslateX = -singlePageWidth * virtualIndexRef.current;
    if (Math.abs(offsetClientY) > 100 && minimal && pullClosable) {
      willClose = true;
      close();
    }
    updateState({
      touched: false,
      x: currentTranslateX,
      lastCX: undefined,
      lastCY: undefined,
      bg: maskOpacity,
      overlay: willClose ? true : overlay,
      description
    });
  }
  const adjacentImages = useAdjacentImages(images, index, enableLoop);
  if (!realVisible) {
    return null;
  }
  const currentOverlayVisible = overlay && !activeAnimation;
  const currentOpacity = visible ? bg : lastBg;
  
  const overlayParams: OverlayRenderProps | undefined = onScale &&
    onRotate && {
      images,
      index,
      visible,
      onClose: close,
      onIndexChange: changeIndex,
      overlayVisible: currentOverlayVisible,
      overlay: currentImage && currentImage.overlay,
      description: currentImage.description,
      scale,
      rotate,
      onScale,
      onRotate,
    };
  const currentSpeed = speedFn ? speedFn(activeAnimation) : defaultSpeed;
  const currentEasing = easingFn ? easingFn(activeAnimation) : defaultEasing;
  const slideSpeed = speedFn ? speedFn(3) : defaultSpeed + 200;
  const slideEasing = easingFn ? easingFn(3) : defaultEasing;
  return (
    <SlidePortal
      className={`MediaView-Portal${!currentOverlayVisible ? ' MediaView-Slider__clean' : ''}${
        !visible ? ' MediaView-Slider__willClose' : ''
      }${className ? ` ${className}` : ''}`}
      role="dialog"
      onClick={(e) => e.stopPropagation()}
      container={portalContainer}
    >
      {visible && <PreventScroll />}
      <div
        className={`MediaView-Slider__Backdrop${maskClassName ? ` ${maskClassName}` : ''}${
          activeAnimation === 1
            ? ' MediaView-Slider__fadeIn'
            : activeAnimation === 2
            ? ' MediaView-Slider__fadeOut'
            : ''
        }`}
        style={{
          background: currentOpacity ? `rgba(0, 0, 0, ${currentOpacity})` : undefined,
          transitionTimingFunction: currentEasing,
          transitionDuration: `${touched ? 0 : currentSpeed}ms`,
          animationDuration: `${currentSpeed}ms`,
        }}
        onAnimationEnd={onAnimationEnd}
      />
      {bannerVisible && (
        <div className="MediaView-Slider__BannerWrap">
          <div className="MediaView-Slider__Counter">
            {index + 1} / {imageLength}
          </div>
          <div className="MediaView-Slider__BannerRight">
            {toolbarRender && overlayParams && toolbarRender(overlayParams)}
            <CloseIcon className="MediaView-Slider__toolbarIcon" onClick={close} />
          </div>
        </div>
      )}
      {adjacentImages.map((item: DataType, currentIndex) => {
        const nextIndex =
          !enableLoop && index === 0 ? index + currentIndex : virtualIndexRef.current - 1 + currentIndex;
        if (item && item.type === 'image') {
          return (
            <>
              <PhotoBox
                key={enableLoop ? `${item.key}/${item.src}/${nextIndex}` : item.key}
                item={item}
                speed={currentSpeed}
                easing={currentEasing}
                visible={visible}
                onReachMove={handleReachMove}
                onReachUp={handleReachUp}
                onPhotoTap={() => handlePhotoTap(photoClosable)}
                onMaskTap={() => handlePhotoTap(maskClosable)}
                wrapClassName={photoWrapClassName}
                className={photoClassName}
                style={{
                  left: `${(innerWidth + horizontalOffset) * nextIndex}px`,
                  transform: `translate3d(${x}px, 0px, 0)`,
                  transition: touched || pause ? undefined : `transform ${slideSpeed}ms ${slideEasing}`,
                }}
                loadingElement={loadingElement}
                brokenElement={brokenElement}
                onPhotoResize={handleResize}
                isActive={(currentImage && currentImage.key) === item.key}
                expose={updateState}
              />
            </>
          );
        } else if (item && item.type === 'video') {
          return (
            <>
              <VideoBox
                key={enableLoop ? `${item.key}/${item.src}/${nextIndex}` : item.key}
                item={item}
                speed={currentSpeed}
                easing={currentEasing}
                visible={visible}
                onReachMove={handleReachMove}
                onReachUp={handleReachUp}
                onPhotoTap={() => handlePhotoTap(photoClosable)}
                onMaskTap={() => handlePhotoTap(maskClosable)}
                wrapClassName={photoWrapClassName}
                className={photoClassName}
                style={{
                  left: `${(innerWidth + horizontalOffset) * nextIndex}px`,
                  transform: `translate3d(${x}px, 0px, 0)`,
                  transition: touched || pause ? undefined : `transform ${slideSpeed}ms ${slideEasing}`,
                }}
                loadingElement={loadingElement}
                brokenElement={brokenElement}
                onPhotoResize={handleResize}
                isActive={(currentImage && currentImage.key) === item.key}
                expose={updateState}
              />
              {}
            </>
          );
        }
        return <></>;
      })}
      {!isTouchDevice && bannerVisible && (
        <>
          {(enableLoop || index !== 0) && (
            <div className="MediaView-Slider__ArrowLeft" onClick={() => changeIndex(index - 1, true)}>
              <ArrowLeft />
            </div>
          )}
          {(enableLoop || index + 1 < imageLength) && (
            <div className="MediaView-Slider__ArrowRight" onClick={() => changeIndex(index + 1, true)}>
              <ArrowRight />
            </div>
          )}
        </>
      )}
      {overlayRender && overlayParams && (
        <div className="MediaView-Slider__Overlay">{overlayRender(overlayParams)}</div>
      )}
    </SlidePortal>
  );
}
