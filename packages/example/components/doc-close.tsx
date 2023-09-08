import React from 'react';
import { MediaProvider, MediaView } from 'media-view-react';
import { ImageList, Image } from './doc-components';
import photo4 from '../images/4.jpg';

export default function DocDemo() {
  return (
    <MediaProvider pullClosable={false} maskClosable={false} maskOpacity={null}>
      <ImageList>
        <MediaView type="image" src={photo4.src}>
          <Image src={photo4.src} />
        </MediaView>
      </ImageList>
    </MediaProvider>
  );
}
