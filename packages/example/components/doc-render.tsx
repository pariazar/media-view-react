import React from 'react';
import { MediaProvider, MediaView } from 'media-view-react';
import { Button, ImageList } from './doc-components';
const elementSize = 400;
export default function DocDemo() {
  return (
    <MediaProvider maskOpacity={0.5} loop={false}>
      <ImageList>
        <MediaView
          type="image"
          width={elementSize}
          height={elementSize}
          render={({ scale, attrs }) => {
            const width = attrs.style!.width as number;
            const offset = (width - elementSize) / elementSize;
            const childScale = scale === 1 ? scale + offset : 1 + offset;
            return (
              <div {...attrs} className={`flex-none bg-white ${attrs.className || ''}`}>
                <div
                  style={{ transform: `scale(${childScale})`, width: elementSize, transformOrigin: '0 0', padding: 20 }}
                >
                  <div className="mb-2">Hello world</div>
                  <Button className="mb-2 w-full" primary>
                    button
                  </Button>
                  <input
                    className="border border-gray-300 h-8 p-2"
                    placeholder="Input"
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            );
          }}
        >
          <Button primary>Click</Button>
        </MediaView>
      </ImageList>
    </MediaProvider>
  );
}
