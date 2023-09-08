/* eslint-disable @typescript-eslint/no-unused-vars */
import type React from 'react';
import { Children, cloneElement, useContext, useEffect, useMemo, useRef } from 'react';
import useInitial from './hooks/useInitial';
import useMethods from './hooks/useMethods';
import type { MediaContextType } from './media-context';
import MediaContext from './media-context';
import type { PhotoRenderParams } from './types';
export interface MediaProps {
  src?: string;
  type: 'image' | 'video' ;
  render?: (props: PhotoRenderParams) => React.ReactNode;
  overlay?: React.ReactNode;
  description?: React.ReactNode;
  width?: number;
  height?: number;
  children?: React.ReactElement;
  triggers?: ('onClick' | 'onDoubleClick')[];
}
const MediaView: React.FC<MediaProps> = ({
  src,
  type,
  render,
  overlay,
  description,
  width,
  height,
  triggers = ['onClick'],
  children,
}) => {
  const mediaContext = useContext<MediaContextType>(MediaContext);
  const key = useInitial(() => mediaContext.nextId());
  const originRef = useRef<HTMLElement>(null);
  useEffect(() => {
    return () => {
      mediaContext.remove(key);
    };
  }, []);
  function invokeChildrenFn(eventName: string, e: React.SyntheticEvent) {
    if (children) {
      const eventFn = children.props[eventName];
      if (eventFn) {
        eventFn(e);
      }
    }
  }
  const fn = useMethods({
    render(props: PhotoRenderParams) {
      return render && render(props);
    },
    show(eventName: string, e: React.MouseEvent) {
      mediaContext.show(key);
      invokeChildrenFn(eventName, e);
    },
  });
  const eventListeners = useMemo(() => {
    const listener = {};
    triggers.forEach((eventName) => {
      listener[eventName] = fn.show.bind(null, eventName);
    });
    return listener;
  }, []);
  useEffect(() => {
    mediaContext.update({
      key,
      type,
      src,
      originRef,
      render: fn.render,
      overlay,
      description,
      width,
      height,
    });
  }, [src]);
  if (children) {
    return Children.only(cloneElement(children, { ...eventListeners, ref: originRef }));
  }
  return null;
};
export default MediaView;
