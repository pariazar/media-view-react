import React from 'react';
import { MediaProvider, MediaView } from 'media-view-react';
import { ImageList, Image, photoImages } from './doc-components';

export default function DocDemo() {
  return (
    <MediaProvider loop={4}>
      <ImageList>
        {photoImages.slice(0, 3).map((item, index) => (
          <MediaView type="image" key={index} src={item}>
            <Image src={item} />
          </MediaView>
        ))}
      </ImageList>
    </MediaProvider>
  );
}
