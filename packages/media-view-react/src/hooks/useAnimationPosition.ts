import type { MutableRefObject } from 'react';
import useAnimationOrigin from './useAnimationOrigin';
import useTargetScale from './useTargetScale';
export default function useAnimationPosition(
  visible: boolean | undefined,
  originRef: MutableRefObject<HTMLElement | null> | undefined,
  loaded: boolean,
  x: number,
  y: number,
  width: number,
  height: number,
  scale: number,
  speed: number,
  updateEasing: (pause: boolean) => void,
) {
  const [autoWidth, autoHeight, autoScale] = useTargetScale(width, height, scale, speed, updateEasing);
  const [easingMode, originRect] = useAnimationOrigin(visible, originRef, loaded, speed, updateEasing);
  const { T, L, W, H, FIT } = originRect;
  const centerWidth = innerWidth / 2;
  const centerHeight = innerHeight / 2;
  const offsetX = centerWidth - (width * scale) / 2;
  const offsetY = centerHeight - (height * scale) / 2;
  const miniMode = easingMode < 3 || easingMode > 4;
  const translateX = miniMode ? (W ? L : centerWidth) : x + offsetX;
  const translateY = miniMode ? (W ? T : centerHeight) : y + offsetY;
  const minScale = W / (width * scale) || 0.01;
  const currentHeight = miniMode && FIT ? autoWidth * (H / W) : autoHeight;
  const currentScale = easingMode === 0 ? autoScale : miniMode ? minScale : autoScale;
  const opacity = miniMode ? (FIT ? 1 : 0) : 1;
  return [translateX, translateY, autoWidth, currentHeight, currentScale, opacity, easingMode, FIT] as const;
}
