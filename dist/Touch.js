/**
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TouchBackend = void 0;
exports.default = createTouchBackend;
var _invariant = _interopRequireDefault(require("invariant"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function getEventClientTouchOffset(e) {
  if (e.targetTouches.length === 1) {
    return getEventClientOffset(e.targetTouches[0]);
  }
}
function getEventClientOffset(e) {
  if (e.targetTouches) {
    return getEventClientTouchOffset(e);
  } else {
    return {
      x: e.clientX,
      y: e.clientY
    };
  }
}

// Used for MouseEvent.buttons (note the s on the end).
var MouseButtons = {
  Left: 1,
  Right: 2,
  Center: 4
};

// Used for e.button (note the lack of an s on the end).
var MouseButton = {
  Left: 0,
  Center: 1,
  Right: 2
};

/**
 * Only touch events and mouse events where the left button is pressed should initiate a drag.
 * @param {MouseEvent | TouchEvent} e The event
 */
function eventShouldStartDrag(e) {
  // For touch events, button will be undefined. If e.button is defined,
  // then it should be MouseButton.Left.
  return e.button === undefined || e.button === MouseButton.Left;
}

/**
 * Only touch events and mouse events where the left mouse button is no longer held should end a drag.
 * It's possible the user mouse downs with the left mouse button, then mouse down and ups with the right mouse button.
 * We don't want releasing the right mouse button to end the drag.
 * @param {MouseEvent | TouchEvent} e The event
 */
function eventShouldEndDrag(e) {
  // Touch events will have buttons be undefined, while mouse events will have e.buttons's left button
  // bit field unset if the left mouse button has been released
  return e.buttons === undefined || (e.buttons & MouseButtons.Left) === 0;
}
var elementsFromPoint = function (x, y) {
  /*
   * Instead of just getting document.elementsFromPoint
   * Instead, find all the shadowroots inside the document
   * and return the set of elementsFromPoint for the document AND all the shadow roots
   *
  */
  var allElements = Array.prototype.slice.call(document.getElementsByTagName('*'), 0);
  var allShadowRoots = allElements.reduce(function (acc, el) {
    if (el.shadowRoot) {
      acc.push(el.shadowRoot);
    }
    return acc;
  }, []);
  var documentElementsFromPoint = document.elementsFromPoint(x, y);
  var shadowRootElementsFromPoint = allShadowRoots.map(function (e) {
    return e.elementsFromPoint(x, y);
  }).flat();
  return [].concat(_toConsumableArray(documentElementsFromPoint), _toConsumableArray(shadowRootElementsFromPoint));
}.bind(typeof document !== 'undefined' ? document : null);
var supportsPassive = function () {
  // simular to jQuery's test
  var supported = false;
  try {
    addEventListener('test', null, Object.defineProperty({}, 'passive', {
      get: function get() {
        supported = true;
      }
    }));
  } catch (e) {}
  return supported;
}();
var ELEMENT_NODE = 1;
function getNodeClientOffset(node) {
  var el = node.nodeType === ELEMENT_NODE ? node : node.parentElement;
  if (!el) {
    return null;
  }
  var _el$getBoundingClient = el.getBoundingClientRect(),
    top = _el$getBoundingClient.top,
    left = _el$getBoundingClient.left;
  return {
    x: left,
    y: top
  };
}
var eventNames = {
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    end: 'mouseup',
    contextmenu: 'contextmenu'
  },
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    end: 'touchend'
  },
  keyboard: {
    keydown: 'keydown'
  }
};
var TouchBackend = /*#__PURE__*/function () {
  function TouchBackend(manager) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, TouchBackend);
    options.delayTouchStart = options.delayTouchStart || options.delay;
    options = _objectSpread({
      enableTouchEvents: true,
      enableMouseEvents: false,
      enableKeyboardEvents: false,
      ignoreContextMenu: false,
      delayTouchStart: 0,
      delayMouseStart: 0,
      touchSlop: 0,
      scrollAngleRanges: undefined
    }, options);
    this.actions = manager.getActions();
    this.monitor = manager.getMonitor();
    this.registry = manager.getRegistry();
    this.enableKeyboardEvents = options.enableKeyboardEvents;
    this.enableMouseEvents = options.enableMouseEvents;
    this.delayTouchStart = options.delayTouchStart;
    this.delayMouseStart = options.delayMouseStart;
    this.ignoreContextMenu = options.ignoreContextMenu;
    this.touchSlop = options.touchSlop;
    this.scrollAngleRanges = options.scrollAngleRanges;
    this.sourceNodes = {};
    this.sourceNodeOptions = {};
    this.sourcePreviewNodes = {};
    this.sourcePreviewNodeOptions = {};
    this.targetNodes = {};
    this.targetNodeOptions = {};
    this.listenerTypes = [];
    this._mouseClientOffset = {};
    this._isScrolling = false;
    if (options.enableMouseEvents) {
      this.listenerTypes.push('mouse');
    }
    if (options.enableTouchEvents) {
      this.listenerTypes.push('touch');
    }
    if (options.enableKeyboardEvents) {
      this.listenerTypes.push('keyboard');
    }
    if (options.getDropTargetElementsAtPoint) {
      this.getDropTargetElementsAtPoint = options.getDropTargetElementsAtPoint;
    }
    this.getSourceClientOffset = this.getSourceClientOffset.bind(this);
    this.handleTopMoveStart = this.handleTopMoveStart.bind(this);
    this.handleTopMoveStartDelay = this.handleTopMoveStartDelay.bind(this);
    this.handleTopMoveStartCapture = this.handleTopMoveStartCapture.bind(this);
    this.handleTopMoveCapture = this.handleTopMoveCapture.bind(this);
    this.handleTopMove = this.handleTopMove.bind(this);
    this.handleTopMoveEndCapture = this.handleTopMoveEndCapture.bind(this);
    this.handleCancelOnEscape = this.handleCancelOnEscape.bind(this);
  }
  _createClass(TouchBackend, [{
    key: "setup",
    value: function setup() {
      if (typeof window === 'undefined') {
        return;
      }
      (0, _invariant.default)(!this.constructor.isSetUp, 'Cannot have two Touch backends at the same time.');
      this.constructor.isSetUp = true;
      this.addEventListener(window, 'start', this.getTopMoveStartHandler());
      this.addEventListener(window, 'start', this.handleTopMoveStartCapture, true);
      this.addEventListener(window, 'move', this.handleTopMove);
      this.addEventListener(window, 'move', this.handleTopMoveCapture, true);
      this.addEventListener(window, 'end', this.handleTopMoveEndCapture, true);
      if (this.enableMouseEvents && !this.ignoreContextMenu) {
        this.addEventListener(window, 'contextmenu', this.handleTopMoveEndCapture);
      }
      if (this.enableKeyboardEvents) {
        this.addEventListener(window, 'keydown', this.handleCancelOnEscape, true);
      }
    }
  }, {
    key: "teardown",
    value: function teardown() {
      if (typeof window === 'undefined') {
        return;
      }
      this.constructor.isSetUp = false;
      this._mouseClientOffset = {};
      this.removeEventListener(window, 'start', this.handleTopMoveStartCapture, true);
      this.removeEventListener(window, 'start', this.handleTopMoveStart);
      this.removeEventListener(window, 'move', this.handleTopMoveCapture, true);
      this.removeEventListener(window, 'move', this.handleTopMove);
      this.removeEventListener(window, 'end', this.handleTopMoveEndCapture, true);
      if (this.enableMouseEvents && !this.ignoreContextMenu) {
        this.removeEventListener(window, 'contextmenu', this.handleTopMoveEndCapture);
      }
      if (this.enableKeyboardEvents) {
        this.removeEventListener(window, 'keydown', this.handleCancelOnEscape, true);
      }
      this.uninstallSourceNodeRemovalObserver();
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(subject, event, handler, capture) {
      var options = supportsPassive ? {
        capture: capture,
        passive: false
      } : capture;
      this.listenerTypes.forEach(function (listenerType) {
        var evt = eventNames[listenerType][event];
        if (evt) {
          subject.addEventListener(evt, handler, options);
        }
      });
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(subject, event, handler, capture) {
      var options = supportsPassive ? {
        capture: capture,
        passive: false
      } : capture;
      this.listenerTypes.forEach(function (listenerType) {
        var evt = eventNames[listenerType][event];
        if (evt) {
          subject.removeEventListener(evt, handler, options);
        }
      });
    }
  }, {
    key: "connectDragSource",
    value: function connectDragSource(sourceId, node, options) {
      var _this = this;
      var handleMoveStart = this.handleMoveStart.bind(this, sourceId);
      this.sourceNodes[sourceId] = node;
      this.addEventListener(node, 'start', handleMoveStart);
      return function () {
        delete _this.sourceNodes[sourceId];
        _this.removeEventListener(node, 'start', handleMoveStart);
      };
    }
  }, {
    key: "connectDragPreview",
    value: function connectDragPreview(sourceId, node, options) {
      var _this2 = this;
      this.sourcePreviewNodeOptions[sourceId] = options;
      this.sourcePreviewNodes[sourceId] = node;
      return function () {
        delete _this2.sourcePreviewNodes[sourceId];
        delete _this2.sourcePreviewNodeOptions[sourceId];
      };
    }
  }, {
    key: "connectDropTarget",
    value: function connectDropTarget(targetId, node) {
      var _this3 = this;
      var handleMove = function handleMove(e) {
        var coords;
        if (!_this3.monitor.isDragging()) {
          return;
        }

        /**
         * Grab the coordinates for the current mouse/touch position
         */
        switch (e.type) {
          case eventNames.mouse.move:
            coords = {
              x: e.clientX,
              y: e.clientY
            };
            break;
          case eventNames.touch.move:
            coords = {
              x: e.touches[0].clientX,
              y: e.touches[0].clientY
            };
            break;
        }

        /**
         * Use the coordinates to grab the element the drag ended on.
         * If the element is the same as the target node (or any of it's children) then we have hit a drop target and can handle the move.
         *
         * Searching within the scope of it's root (either shadowRoot OR document)
         */
        var elementRoot = node.getRootNode() === document ? document : node.getRootNode();
        var droppedOn = elementRoot.elementFromPoint(coords.x, coords.y);
        var childMatch = node.contains(droppedOn);
        if (droppedOn === node || childMatch) {
          return _this3.handleMove(e, targetId);
        }
      };

      /**
       * Attaching the event listener to the body so that touchmove will work while dragging over multiple target elements.
       */
      this.addEventListener(document.querySelector('body'), 'move', handleMove);
      this.targetNodes[targetId] = node;
      return function () {
        delete _this3.targetNodes[targetId];
        _this3.removeEventListener(document.querySelector('body'), 'move', handleMove);
      };
    }
  }, {
    key: "getSourceClientOffset",
    value: function getSourceClientOffset(sourceId) {
      return getNodeClientOffset(this.sourceNodes[sourceId]);
    }
  }, {
    key: "handleTopMoveStartCapture",
    value: function handleTopMoveStartCapture(e) {
      if (!eventShouldStartDrag(e)) {
        return;
      }
      this.moveStartSourceIds = [];
    }
  }, {
    key: "handleMoveStart",
    value: function handleMoveStart(sourceId) {
      // Just because we received an event doesn't necessarily mean we need to collect drag sources.
      // We only collect start collecting drag sources on touch and left mouse events.
      if (Array.isArray(this.moveStartSourceIds)) {
        this.moveStartSourceIds.unshift(sourceId);
      }
    }
  }, {
    key: "getTopMoveStartHandler",
    value: function getTopMoveStartHandler() {
      if (!this.delayTouchStart && !this.delayMouseStart) {
        return this.handleTopMoveStart;
      }
      return this.handleTopMoveStartDelay;
    }
  }, {
    key: "handleTopMoveStart",
    value: function handleTopMoveStart(e) {
      if (!eventShouldStartDrag(e)) {
        return;
      }

      // Don't prematurely preventDefault() here since it might:
      // 1. Mess up scrolling
      // 2. Mess up long tap (which brings up context menu)
      // 3. If there's an anchor link as a child, tap won't be triggered on link

      var clientOffset = getEventClientOffset(e);
      if (clientOffset) {
        this._mouseClientOffset = clientOffset;
      }
      this.waitingForDelay = false;
    }
  }, {
    key: "handleTopMoveStartDelay",
    value: function handleTopMoveStartDelay(e) {
      if (!eventShouldStartDrag(e)) {
        return;
      }
      var delay = e.type === eventNames.touch.start ? this.delayTouchStart : this.delayMouseStart;
      this.timeout = setTimeout(this.handleTopMoveStart.bind(this, e), delay);
      this.waitingForDelay = true;
    }
  }, {
    key: "handleTopMoveCapture",
    value: function handleTopMoveCapture(e) {
      this.dragOverTargetIds = [];
    }
  }, {
    key: "handleMove",
    value: function handleMove(e, targetId) {
      this.dragOverTargetIds.unshift(targetId);
    }
  }, {
    key: "handleTopMove",
    value: function handleTopMove(e) {
      var _this4 = this;
      clearTimeout(this.timeout);
      if (this.waitingForDelay) {
        return;
      }
      var moveStartSourceIds = this.moveStartSourceIds,
        dragOverTargetIds = this.dragOverTargetIds;
      var clientOffset = getEventClientOffset(e);
      if (!clientOffset) {
        return;
      }

      // If the touch move started as a scroll, or is is between the scroll angles
      if (this._isScrolling || !this.monitor.isDragging() && inAngleRanges(this._mouseClientOffset.x, this._mouseClientOffset.y, clientOffset.x, clientOffset.y, this.scrollAngleRanges)) {
        this._isScrolling = true;
        return;
      }

      // If we're not dragging and we've moved a little, that counts as a drag start
      if (!this.monitor.isDragging() && this._mouseClientOffset.hasOwnProperty('x') && moveStartSourceIds && distance(this._mouseClientOffset.x, this._mouseClientOffset.y, clientOffset.x, clientOffset.y) > (this.touchSlop ? this.touchSlop : 0)) {
        this.moveStartSourceIds = null;
        this.actions.beginDrag(moveStartSourceIds, {
          clientOffset: this._mouseClientOffset,
          getSourceClientOffset: this.getSourceClientOffset,
          publishSource: false
        });
      }
      if (!this.monitor.isDragging()) {
        return;
      }
      var sourceNode = this.sourceNodes[this.monitor.getSourceId()];
      this.installSourceNodeRemovalObserver(sourceNode);
      this.actions.publishDragSource();
      e.preventDefault();

      // Get the node elements of the hovered DropTargets
      var dragOverTargetNodes = dragOverTargetIds.map(function (key) {
        return _this4.targetNodes[key];
      });
      // Get the a ordered list of nodes that are touched by
      var elementsAtPoint = this.getDropTargetElementsAtPoint ? this.getDropTargetElementsAtPoint(clientOffset.x, clientOffset.y, dragOverTargetNodes) : elementsFromPoint(clientOffset.x, clientOffset.y);
      // Extend list with parents that are not receiving elementsFromPoint events (size 0 elements and svg groups)
      var elementsAtPointExtended = [];
      for (var nodeId in elementsAtPoint) {
        if (!elementsAtPoint.hasOwnProperty(nodeId)) {
          continue;
        }
        var currentNode = elementsAtPoint[nodeId];
        elementsAtPointExtended.push(currentNode);
        while (currentNode) {
          currentNode = currentNode.parentElement;
          if (!elementsAtPointExtended.includes(currentNode)) {
            elementsAtPointExtended.push(currentNode);
          }
        }
      }
      var orderedDragOverTargetIds = elementsAtPointExtended
      // Filter off nodes that arent a hovered DropTargets nodes
      .filter(function (node) {
        return dragOverTargetNodes.indexOf(node) > -1;
      })
      // Map back the nodes elements to targetIds
      .map(function (node) {
        for (var targetId in _this4.targetNodes) {
          if (node === _this4.targetNodes[targetId]) {
            return targetId;
          }
        }
        return null;
      })
      // Filter off possible null rows
      .filter(function (node) {
        return !!node;
      }).filter(function (id, index, ids) {
        return ids.indexOf(id) === index;
      });

      // Reverse order because dnd-core reverse it before calling the DropTarget drop methods
      orderedDragOverTargetIds.reverse();
      this.actions.hover(orderedDragOverTargetIds, {
        clientOffset: clientOffset
      });
    }
  }, {
    key: "handleTopMoveEndCapture",
    value: function handleTopMoveEndCapture(e) {
      this._isScrolling = false;
      if (!eventShouldEndDrag(e)) {
        return;
      }
      if (!this.monitor.isDragging() || this.monitor.didDrop()) {
        this.moveStartSourceIds = null;
        return;
      }
      e.preventDefault();
      this._mouseClientOffset = {};
      this.uninstallSourceNodeRemovalObserver();
      this.actions.drop();
      this.actions.endDrag();
    }
  }, {
    key: "handleCancelOnEscape",
    value: function handleCancelOnEscape(e) {
      if (e.key === 'Escape' && this.monitor.isDragging()) {
        this._mouseClientOffset = {};
        this.uninstallSourceNodeRemovalObserver();
        this.actions.endDrag();
      }
    }
  }, {
    key: "handleOnContextMenu",
    value: function handleOnContextMenu() {
      this.moveStartSourceIds = null;
    }
  }, {
    key: "installSourceNodeRemovalObserver",
    value: function installSourceNodeRemovalObserver(node) {
      var _this5 = this;
      this.uninstallSourceNodeRemovalObserver();
      this.draggedSourceNode = node;
      this.draggedSourceNodeRemovalObserver = new window.MutationObserver(function () {
        if (!node.parentElement) {
          _this5.resurrectSourceNode();
          _this5.uninstallSourceNodeRemovalObserver();
        }
      });
      if (!node || !node.parentElement) {
        return;
      }
      this.draggedSourceNodeRemovalObserver.observe(node.parentElement, {
        childList: true
      });
    }
  }, {
    key: "resurrectSourceNode",
    value: function resurrectSourceNode() {
      this.draggedSourceNode.style.display = 'none';
      this.draggedSourceNode.removeAttribute('data-reactid');
      document.body.appendChild(this.draggedSourceNode);
    }
  }, {
    key: "uninstallSourceNodeRemovalObserver",
    value: function uninstallSourceNodeRemovalObserver() {
      if (this.draggedSourceNodeRemovalObserver) {
        this.draggedSourceNodeRemovalObserver.disconnect();
      }
      this.draggedSourceNodeRemovalObserver = null;
      this.draggedSourceNode = null;
    }
  }]);
  return TouchBackend;
}();
exports.TouchBackend = TouchBackend;
function createTouchBackend() {
  var optionsOrManager = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var touchBackendFactory = function touchBackendFactory(manager) {
    return new TouchBackend(manager, optionsOrManager);
  };
  if (optionsOrManager.getMonitor) {
    return touchBackendFactory(optionsOrManager);
  } else {
    return touchBackendFactory;
  }
}
function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(Math.abs(x2 - x1), 2) + Math.pow(Math.abs(y2 - y1), 2));
}
function inAngleRanges(x1, y1, x2, y2, angleRanges) {
  if (angleRanges == null) {
    return false;
  }
  var angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI + 180;
  for (var i = 0; i < angleRanges.length; ++i) {
    if ((angleRanges[i].start == null || angle >= angleRanges[i].start) && (angleRanges[i].end == null || angle <= angleRanges[i].end)) {
      return true;
    }
  }
  return false;
}
