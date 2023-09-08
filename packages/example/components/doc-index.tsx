import React from 'react';
import { MediaProvider, MediaView } from 'media-view-react';
import { ImageList, photoImages, Image } from './doc-components';

export default function DocDemo() {
  return (
    <MediaProvider>
      <ImageList>
        {photoImages.map((item, index) => (
          <MediaView type="image" key={index} src={item}>
            <Image src={item} />
          </MediaView>
        ))}
      </ImageList>
    </MediaProvider>
  );
}
