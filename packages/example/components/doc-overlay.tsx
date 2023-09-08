import React from 'react';
import { MediaView, MediaProvider } from 'media-view-react';
import { ImageList, Overlay, photoImages, Image } from './doc-components';
import photo1 from '../images/1.jpg';
import photo2 from '../images/2.jpg';
import photo3 from '../images/3.jpg';
import photo4 from '../images/4.jpg';
import photo5 from '../images/5.jpg';
import photo6 from '../images/6.jpg';

const filesInfo = [
  { src: photo1.src, type: 'image' },
  { src: photo2.src, type: 'image' },
  { src: photo3.src, type: 'image' },
  { src: photo4.src, type: 'image' },
  { src: photo5.src, type: 'image' },
  { src: photo6.src, type: 'image' },
  { src: 'https://github.com/intel-iot-devkit/sample-videos/raw/master/bottle-detection.mp4', type: 'video' },
];

export default function DocDemo() {
  return (
    <MediaProvider
      overlayRender={({ rotate, onRotate, scale, overlay,description }) => {
        
        return (
          <Overlay>
            <div>file: {overlay}</div>
            <div>description: {description}</div>
          </Overlay>
        );
      }}
    >
      {filesInfo.map((item, index) => (
        <React.Fragment key={index}>
          {item.type === 'image' ? (
            <MediaView
              type="image"
              src={item.src}
              overlay={<div>{item.src}</div>}
              description={<div>{item.src+ "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu scelerisque felis imperdiet proin fermentum leo. Elementum tempus egestas sed sed. Id porta nibh venenatis cras sed. Ut venenatis tellus in metus vulputate eu scelerisque felis imperdiet. Orci eu lobortis elementum nibh. Praesent semper feugiat nibh sed. Habitant morbi tristique senectus et. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Dignissim convallis aenean et tortor. Convallis posuere morbi leo urna molestie at elementum. Malesuada pellentesque elit eget gravida. In cursus turpis massa tincidunt dui ut ornare lectus. Cras adipiscing enim eu turpis egestas pretium aenean. Habitant morbi tristique senectus et netus et. Cras pulvinar mattis nunc sed blandit libero volutpat sed. Vulputate enim nulla aliquet porttitor lacus luctus. Porttitor rhoncus dolor purus non enim praesent elementum facilisis leo. Neque sodales ut etiam sit amet nisl purus in mollis."}</div>}
            >
              <Image src={item.src} />
            </MediaView>
          ) : (
            <MediaView
              type="video"
              src={item.src}
              overlay={<div>{item.src}</div>}
            >
              <video src={item.src} />
            </MediaView>
          )}
        </React.Fragment>
      ))}
    </MediaProvider>
  );
}
