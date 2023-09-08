export default function getRotateSize(rotate: number, width: number, height: number) {
  const isVertical = rotate % 180 !== 0;
  if (isVertical) {
    return [height, width, isVertical] as const;
  }
  return [width, height, isVertical] as const;
}
