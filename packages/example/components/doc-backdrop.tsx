import React from 'react';
import { MediaProvider, MediaView } from 'media-view-react';
import { ImageList, Image } from './doc-components';
import photo2 from '../images/2.jpg';

export default function DocDemo() {
  return (
    <MediaProvider maskOpacity={0.5}>
      <ImageList>
        <MediaView type="image" src={photo2.src}>
          <Image src={photo2.src} />
        </MediaView>
      </ImageList>
    </MediaProvider>
  );
}
