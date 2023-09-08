import { longModeRatio } from '../variables';
import { computePositionEdge } from './edgeHandle';
export default function getPositionOnMoveOrScale(
  x: number,
  y: number,
  width: number,
  height: number,
  scale: number,
  toScale: number,
  clientX: number = innerWidth / 2,
  clientY: number = innerHeight / 2,
  offsetX: number = 0,
  offsetY: number = 0,
) {
  const [closedEdgeX] = computePositionEdge(x, toScale, width, innerWidth);
  const [closedEdgeY] = computePositionEdge(y, toScale, height, innerHeight);
  const centerClientX = innerWidth / 2;
  const centerClientY = innerHeight / 2;
  const lastPositionX = centerClientX + x;
  const lastPositionY = centerClientY + y;
  const originX = clientX - (clientX - lastPositionX) * (toScale / scale) - centerClientX;
  const originY = clientY - (clientY - lastPositionY) * (toScale / scale) - centerClientY;
  const longModeEdge = height / width >= longModeRatio && width * toScale === innerWidth;
  return {
    x: originX + (longModeEdge ? 0 : closedEdgeX ? offsetX / 2 : offsetX),
    y: originY + (closedEdgeY ? offsetY / 2 : offsetY),
    lastCX: clientX,
    lastCY: clientY,
  };
}
