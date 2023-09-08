import type React from 'react';
export interface DataType {
  key: number | string;
  type: 'image' | 'video';
  src?: string;
  render?: (props: PhotoRenderParams) => React.ReactNode;
  overlay?: React.ReactNode;
  description?: React.ReactNode;
  width?: number;
  height?: number;
  originRef?: React.MutableRefObject<HTMLElement | null>;
}
export interface MediaProviderBase {
  loop?: boolean | number;
  speed?: (type: ActiveAnimationType) => number;
  easing?: (type: ActiveAnimationType) => string;
  photoClosable?: boolean;
  maskClosable?: boolean;
  maskOpacity?: number | null;
  pullClosable?: boolean;
  bannerVisible?: boolean;
  overlayRender?: (overlayProps: OverlayRenderProps) => React.ReactNode;
  toolbarRender?: (overlayProps: OverlayRenderProps) => React.ReactNode;
  className?: string;
  maskClassName?: string;
  photoWrapClassName?: string;
  photoClassName?: string;
  loadingElement?: JSX.Element;
  brokenElement?: JSX.Element | ((photoProps: BrokenElementParams) => JSX.Element);
  portalContainer?: HTMLElement;
}
export type PhotoRenderParams = {
  attrs: Partial<React.HTMLAttributes<HTMLElement>>;
  scale: number;
  rotate: number;
};
export interface BrokenElementParams {
  src: string;
}
export interface OverlayRenderProps {
  images: DataType[];
  index: number;
  onIndexChange: (index: number) => void;
  visible: boolean;
  onClose: (evt?: React.MouseEvent | React.TouchEvent) => void;
  overlayVisible: boolean;
  overlay?: React.ReactNode;
  description?: React.ReactNode;
  rotate: number;
  onRotate: (rotate: number) => void;
  scale: number;
  onScale: (scale: number) => void;
}
export interface ExposedProperties {
  scale?: number;
  rotate?: number;
  onScale?: (scale: number) => void;
  onRotate?: (rotate: number) => void;
}
export type ReachMoveFunction = (reachPosition: ReachType, clientX: number, clientY: number, scale?: number) => void;
export type ReachFunction = (clientX: number, clientY: number) => void;
export type PhotoTapFunction = (clientX: number, clientY: number) => void;
export type CloseEdgeType =
  | 1
  | 2
  | 3
  | undefined;
export type ReachType =
  | 'x'
  | 'y'
  | undefined;
export type TouchStartType =
  | 0
  | 1
  | 2
  | 3;
export type OriginRectType = {
  T: number;
  L: number;
  W: number;
  H: number;
  FIT: 'contain' | 'cover' | 'fill' | undefined;
};
export type EasingMode =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5;
export type ActiveAnimationType =
  | 0
  | 1
  | 2
  | 3;
