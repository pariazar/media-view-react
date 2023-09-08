import React from 'react';
import { MediaProvider, MediaView } from 'media-view-react';
import { ImageList } from './doc-components';
import photo8 from '../images/8.jpg';

export default function DocDemo() {
  return (
    <MediaProvider>
      <ImageList>
        <MediaView type="image" src={photo8.src}>
          <img src={photo8.src} className="block w-32 h-32 object-cover" alt="" />
        </MediaView>
      </ImageList>
    </MediaProvider>
  );
}
