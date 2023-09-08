import React from 'react';
import { MediaProvider, MediaView } from 'media-view-react';
import { ImageList } from './doc-components';
import photo6 from '../images/6.jpg';

export default function DocDemo() {
  return (
    <MediaProvider speed={() => 800}>
      <ImageList>
        <MediaView type="image" src={photo6.src}>
          <img src={photo6.src} className="block w-32 h-32 md:w-64 md:h-64 object-cover" alt="" />
        </MediaView>
      </ImageList>
    </MediaProvider>
  );
}
