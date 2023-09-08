import React from 'react';
import { MediaProvider, MediaView } from 'media-view-react';
import { ImageList, Image } from './doc-components';
import photo5 from '../images/5.jpg';

export default function DocDemo() {
  return (
    <MediaProvider maskOpacity={0.5} bannerVisible={false}>
      <ImageList>
        <MediaView type="image" src={photo5.src}>
          <Image src={photo5.src} />
        </MediaView>
      </ImageList>
    </MediaProvider>
  );
}
