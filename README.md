# media-view-react

**English**

**Modern React media preview component.**

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]
[![Minified size][min-size-image]][bundlephobia-url]
[![Gzip size][gzip-size-image]][bundlephobia-url]

## Quick start

- [Getting Started](https://media-view-react.vercel.app)
- [Basic usage](https://media-view-react.vercel.app/docs/getting-started)
- [API](https://media-view-react.vercel.app/docs/api)
- [Change log](https://media-view-react.vercel.app/docs/change-log)

## features

- Seamlessly incorporate touch gestures, enabling intuitive actions like dragging, panning with realistic physical effects, and effortless two-finger zooming in and out.
- Elevate your animations with smooth transitions, including natural rebounding when opening and closing elements, ensuring a delightful user experience.
- Ensure images are dynamically adaptive, optimizing initial rendering size and adjusting dynamically based on user modifications.
- Extend versatility by supporting custom previews for any HTML element, `<video>` or any `HTML` element
- Facilitate effortless keyboard navigation, making it an ideal choice for desktop users.
- Empower users with custom node expansion, enabling features such as full-screen previews, rotation control, and image descriptions.
- Based on `typescript`, `7KB Gzipped`, supports server-side rendering
- Simple and easy to use `API`, zero cost to get started

## Install

```bash
yarn add media-view-react
```

## Basic usage:

```js
import { MediaProvider, MediaView } from 'media-view-react';
import 'media-view-react/dist/media-view-react.css';

function App() {
  return (
    <MediaProvider>
      <div className="foo">
        {item.type === 'image' ? (
          <MediaView type="image" src={item.src}>
            <Image src={item.src} />
          </MediaView>
        ) : (
          <MediaView type="video" src={item.src}>
            {/*thumbnail of video it can be video or img html tag*/}
            <video src={item.src} />
          </MediaView>
        )}
      </div>
    </MediaProvider>
  );
}
```

## License

Apache-2.0 © [pariazar](https://github.com/pariazar)

[npm-image]: https://img.shields.io/npm/v/media-view-react.svg?style=flat-square
[npm-url]: https://npmjs.org/package/media-view-react
[downloads-image]: http://img.shields.io/npm/dm/media-view-react.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/media-view-react
[min-size-image]: https://badgen.net/bundlephobia/min/media-view-react?label=minified
[gzip-size-image]: https://badgen.net/bundlephobia/minzip/media-view-react?label=gzip
[bundlephobia-url]: https://bundlephobia.com/result?p=media-view-react
