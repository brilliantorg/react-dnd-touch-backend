# Brilliant "Fork" Information:

## Background

When bringing the Quantum Circuits over from V2 to V3, there were issues with it working inside of the ShadowDOM, since react-dnd-touch-backend did not properly handle the shadowDOM.

See as background:

- https://brilliant.atlassian.net/browse/LIX-1141
- https://brilliant.atlassian.net/browse/LIX-1322
- https://github.com/react-dnd/react-dnd/issues/3449

Therefore, a fix needed to be made here, in touch-dnd-backend


## Not Really A Fork

Unforunately, we rely on version 0.5.2. Updating versions is incompatible with react-dnd - which led to a chain of having to update `react-dnd` -> `preact-dnd` -> `preact` itself. Things in that ecosystem had moved on past the point of feasibility to do this upgrade work in the timeline given. The entire API moved from Providers to Hooks, etc. etc.


Notably also, the source code for this version was no longer hosted!! The initial project `react-dnd-touch-backend` was at the time part of the `yahoo/react-dnd-touch-backend`, but by the time of this "fork", the project was subsumed by `react-dnd` itself and the source code at the point was online.

This repository was created by simply copying the source code __out of the node_modules__ directory in the main brilliant repo!!





# Everything below is the original readme!

<img src="https://avatars2.githubusercontent.com/u/6412038?v=3&s=200" alt="react logo" title="react" align="right" width="64" height="64" />

# react-dnd-touch-backend

[![npm version](https://badge.fury.io/js/react-dnd-touch-backend.svg)](http://badge.fury.io/js/react-dnd-touch-backend)
[![Dependency Status](https://david-dm.org/yahoo/react-dnd-touch-backend.svg)](https://david-dm.org/yahoo/react-dnd-touch-backend)
[![devDependency Status](https://david-dm.org/yahoo/react-dnd-touch-backend/dev-status.svg)](https://david-dm.org/yahoo/react-dnd-touch-backend#info=devDependencies)
![gzip size](http://img.badgesize.io/https://npmcdn.com/react-dnd-touch-backend?compression=gzip)

Touch Backend for [react-dnd](https://github.com/gaearon/react-dnd)

## Usage
Follow [react-dnd docs](http://gaearon.github.io/react-dnd/) to setup your app. Then swap out `HTML5Backend` for `TouchBackend` as such:

```js
import React, { Component } from 'react';
import TouchBackend from 'react-dnd-touch-backend';
import { DragDropContext } from 'react-dnd';

class YourApp extends Component {
  /* ... */
}

export default DragDropContext(TouchBackend)(YourApp);
```

### Options

You have the following options available to you, which you can pass in like so:

```js
DragDropContext(TouchBackend(options))
```

Options include:

- enableTouchEvents
- enableMouseEvents
- enableKeyboardEvents
- delayTouchStart
- delayMouseStart
- touchSlop
- ignoreContextMenu
- scrollAngleRanges

## Tips
### Drag Preview
Since native Drag-n-Drop is not currently supported in touch devices. A custom [DragPreview](https://gaearon.github.io/react-dnd/docs-drag-layer.html) is required. Check out the [example](https://github.com/yahoo/react-dnd-touch-backend/blob/master/examples/js/ItemPreview.jsx) for a sample implementation.

We might try to build it directly in the Backend itself in the future to compensate for this limitation.

### Mouse events support*
You can enable capturing mouse events by configuring your TouchBackend as follows:
```js
DragDropContext(TouchBackend({ enableMouseEvents: true }));
```
**NOTE*: This is buggy due to the difference in `touchstart/touchend` event propagation compared to `mousedown/mouseup/click`. I highly recommend that you use [react-dnd-html5-backend](https://github.com/gaearon/react-dnd-html5-backend) instead for a more performant native HTML5 drag capability.**

### Other options
**touchSlop**

* Specifies the pixel distance moved before a drag is signaled.
* Default: 0
```js
DragDropContext(TouchBackend({ touchSlop: 20 }));
```
**ignoreContextMenu**

* If true, prevents the `contextmenu` event from canceling a drag.
* Default: false
```js
DragDropContext(TouchBackend({ ignoreContextMenu: true }));
```

**scrollAngleRanges**

* Specifies ranges of angles in degrees that drag events should be ignored. This is useful when you want to allow the 
user to scroll in a particular direction instead of dragging. Degrees move clockwise, 0/360 pointing to the 
left. 
* Default: undefined
```js
// allow vertical scrolling
DragDropContext(TouchBackend({ scrollAngleRanges: [{ start: 30, end: 150 }, { start: 210, end: 330 }] }));

// allow horizontal scrolling
DragDropContext(TouchBackend({ scrollAngleRanges: [{ start: 300 }, { end: 60 }, { start: 120, end: 240 }] }));
```

**getDropTargetElementsAtPoint**
* Specify a custom function to find drop target elements at the given point.  Useful for improving performance in environments (iOS Safari) where document.elementsFromPoint is not available.
* Default: undefined (use document.elementsFromPoint or inline elementsFromPoint "polyfill")
```js
const hasNative = document && (document.elementsFromPoint || document.msElementsFromPoint);

function getDropTargetElementsAtPoint(x, y, availableDropTargets) {
  return dropTargets.filter(t => {
    const rect = t.getBoundingClientRect();
    return (x >= rect.left && x <= rect.right && 
            y <= rect.bottom && y >= rect.top);
  });
}

// use custom function only if elementsFromPoint is not supported 
DragDropContext(TouchBackend({
  getDropTargetElementsAtPoint: !hasNative && getDropTargetElementsAtPoint,
}))
```

## Examples
The `examples` folder has a sample integration. In order to build it, run:
```bash
npm i && npm run dev
```
Then navigate to `localhost:7789` or `(IP Address):7789` in your mobile browser to access the example.
Code licensed under the MIT license. See LICENSE file for terms.
