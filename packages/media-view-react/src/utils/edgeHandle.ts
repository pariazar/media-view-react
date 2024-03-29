import type { CloseEdgeType } from '../types';
import type { ReachType, TouchStartType } from '../types';
export const getReachType = (
  initialTouchState: TouchStartType,
  horizontalCloseEdge: CloseEdgeType,
  verticalCloseEdge: CloseEdgeType,
  reachPosition: ReachType,
): ReachType => {
  if ((horizontalCloseEdge && initialTouchState === 1) || reachPosition === 'x') {
    return 'x';
  } else if ((verticalCloseEdge && initialTouchState > 1) || reachPosition === 'y') {
    return 'y';
  }
  return undefined;
};
export const computePositionEdge = (position: number, scale: number, size: number, innerSize: number) => {
  const currentWidth = size * scale;
  const outOffset = (currentWidth - innerSize) / 2;
  let closedEdge: CloseEdgeType = undefined;
  let current = position;
  if (currentWidth <= innerSize) {
    closedEdge = 1;
    current = 0;
  } else if (position > 0 && outOffset - position <= 0) {
    closedEdge = 2;
    current = outOffset;
  } else if (position < 0 && outOffset + position <= 0) {
    closedEdge = 3;
    current = -outOffset;
  }
  return [closedEdge, current] as const;
};
