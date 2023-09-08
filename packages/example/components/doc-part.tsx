import React from 'react';
import { MediaView, MediaProvider } from 'media-view-react';
import { ImageList, photoImages, Image } from './doc-components';

export default function DocDemo() {
  return (
    <MediaProvider>
      <ImageList>
        {photoImages.map((item, index) => (
          <MediaView type="image" key={index} src={item}>
            {index < 2 ? <Image src={item} /> : undefined}
          </MediaView>
        ))}
      </ImageList>
    </MediaProvider>
  );
}
