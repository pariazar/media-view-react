import React from 'react';
import { MediaProvider, MediaView } from 'media-view-react';
import { Button, ImageList } from './doc-components';
import { EosIconsBubbleLoading } from '../icons/EosIconsBubbleLoading';
import defaultPhoto from '../images/default-photo.svg';

export default function DocDemo() {
  return (
    <ImageList>
      <MediaProvider
        loadingElement={<EosIconsBubbleLoading className="text-white w-8 h-8" />}
        brokenElement={<img className="w-32 h-32" src={defaultPhoto.src} alt="" />}
      >
        <MediaView type="image" src="/error.png">
          <Button>Click</Button>
        </MediaView>
      </MediaProvider>
    </ImageList>
  );
}
