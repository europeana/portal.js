import { Control } from 'ol/control.js';
import EventType from 'ol/events/EventType.js';
import { easeOut } from 'ol/easing.js';

export default class ZoomControlsControl extends Control {
  /**
   * @param {Object} [options] Control options.
   */
  constructor(options = {}) {
    const delta = options.delta ? options.delta : 1;

    const inButton = document.createElement('button');
    const zoomInIcon = document.createElement('span');
    zoomInIcon.className = 'icon icon-zoom-in';
    inButton.appendChild(zoomInIcon);
    inButton.setAttribute('title', options.zoomInTipLabel || 'Zoom in');

    const resetButton = document.createElement('button');
    const resetZoomIcon = document.createElement('span');
    resetZoomIcon.className = 'icon icon-reset';
    resetButton.appendChild(resetZoomIcon);
    resetButton.setAttribute('title', options.resetZoomTipLabel || 'Reset zoom');

    const outButton = document.createElement('button');
    const zoomOutIcon = document.createElement('span');
    zoomOutIcon.className = 'icon icon-zoom-out';
    outButton.appendChild(zoomOutIcon);
    outButton.setAttribute('title', options.zoomOutTipLabel || 'Zoom out');

    const element = document.createElement('div');
    element.className = 'ol-zoom-controls ol-unselectable ol-control';
    element.appendChild(inButton);
    element.appendChild(resetButton);
    element.appendChild(outButton);

    super({
      element,
      target: options.target
    });

    inButton.addEventListener(
      EventType.CLICK,
      this.handleClick.bind(this, delta),
      false
    );

    outButton.addEventListener(
      EventType.CLICK,
      this.handleClick.bind(this, -delta),
      false
    );

    resetButton.addEventListener(
      EventType.CLICK,
      this.handleResetZoom.bind(this),
      false
    );

    this.defaultExtent = options.defaultExtent ? options.defaultExtent : 1;
    this.duration = options.duration ? options.duration : 250;
  }

  handleResetZoom() {
    event.preventDefault();
    this.getMap().getView().fit(this.defaultExtent);
  }

  /**
   * @param {number} delta Zoom delta.
   * @public
   */
  setDefaultExtent(extent) {
    this.defaultExtent = extent;
  }

  /**
   * @param {number} delta Zoom delta.
   * @param {MouseEvent} event The event to handle
   * @private
   */
  handleClick(delta, event) {
    event.preventDefault();
    this.zoomByDelta(delta);
  }

  /**
   * @param {number} delta Zoom delta.
   * @private
   */
  zoomByDelta(delta) {
    const map = this.getMap();
    const view = map.getView();
    if (!view) {
      // the map does not have a view, so we can't act
      // upon it
      return;
    }
    const currentZoom = view.getZoom();
    if (currentZoom !== undefined) {
      const newZoom = view.getConstrainedZoom(currentZoom + delta);
      if (this.duration > 0) {
        if (view.getAnimating()) {
          view.cancelAnimations();
        }
        view.animate({
          zoom: newZoom,
          duration: this.duration,
          easing: easeOut
        });
      } else {
        view.setZoom(newZoom);
      }
    }
  }
}
