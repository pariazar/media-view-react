import React from 'react';
import { MediaProvider, MediaView } from 'media-view-react';
import { ImageList } from './doc-components';
import photo3 from '../images/3.jpg';
import photo4 from '../images/4.jpg';

export default function DocDemo() {
  return (
    <MediaProvider
      speed={() => 800}
      easing={(type) => (type === 2 ? 'cubic-bezier(0.36, 0, 0.66, -0.56)' : 'cubic-bezier(0.34, 1.56, 0.64, 1)')}
    >
      <ImageList>
        <div>
          <MediaView type="image" src={photo3.src}>
            <img src={photo3.src} className="h-32" alt="" />
          </MediaView>

          <MediaView type="image" src={photo4.src} />
        </div>
      </ImageList>
    </MediaProvider>
  );
}
