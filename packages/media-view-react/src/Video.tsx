import React from 'react';
import Spinner from './components/Spinner';
// import useMountedRef from './hooks/useMountedRef';
import type { BrokenElementParams } from './types';
import './Video.less';

export interface IPhotoLoadedParams {
  loaded?: boolean;
  naturalWidth?: number;
  naturalHeight?: number;
  broken?: boolean;
}

export interface IPhotoProps extends React.HTMLAttributes<HTMLElement> {
  src: string;
  loaded: boolean;
  broken: boolean;
  onPhotoLoad: (params: IPhotoLoadedParams) => void;
  loadingElement?: JSX.Element;
  brokenElement?: JSX.Element | ((photoProps: BrokenElementParams) => JSX.Element);
}

export default function Photo({
  src,
  loaded,
  broken,
  className,
  onPhotoLoad,
  loadingElement,
  brokenElement,
  ...restProps
}: IPhotoProps) {
  // const mountedRef = useMountedRef();

  // function handleImageLoaded(e: React.SyntheticEvent<HTMLImageElement>) {
  //   const { naturalWidth, naturalHeight } = e.target as HTMLImageElement;
  //   if (mountedRef.current) {
  //     onPhotoLoad({
  //       loaded: true,
  //       naturalWidth,
  //       naturalHeight,
  //     });
  //   }
  // }

  // function handleImageBroken() {
  //   if (mountedRef.current) {
  //     onPhotoLoad({
  //       broken: true,
  //     });
  //   }
  // }

  if (src) {
    return (
      <>
        {/* <img
          className={`MediaView__Photo${className ? ` ${className}` : ''}`}
          src={src}
          onLoad={handleImageLoaded}
          onError={handleImageBroken}
          alt=""
          {...restProps}
        /> */}
        <video
          className={'centered-video'}
          // className={`MediaView__Photo${className ? ` ${className}` : ''}`}
          src={src}
          controls={true}
          muted={false}
          playsInline={true}
          // onLoad={handleImageLoaded}
          // onError={handleImageBroken}
          // alt=""
        />

        {!loaded &&
          (<span className="MediaView__icon">{loadingElement}</span> || <Spinner className="MediaView__icon" />)}
      </>
    );
  }

  // if (brokenElement) {
  //   return (
  //     <span className="MediaView__icon">
  //       {typeof brokenElement === 'function' ? brokenElement({ src }) : brokenElement}
  //     </span>
  //   );
  // }

  return null;
}