import React from 'react';
import { MediaProvider, MediaView } from 'media-view-react';
import { Button, ImageList } from './doc-components';
import photo4 from '../images/4.jpg';

export default function DocDemo() {
  return (
    <MediaProvider>
      <ImageList>
        <MediaView type="image" src={photo4.src}>
          <Button primary>Click</Button>
        </MediaView>
      </ImageList>
    </MediaProvider>
  );
}
