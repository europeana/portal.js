import { Control } from 'ol/control.js';
import EventType from 'ol/events/EventType.js';
import { easeOut } from 'ol/easing.js';

export default class ZoomControlsControl extends Control {
  /**
   * @param {Object} [options] Control options.
   */
  constructor(options = {}) {
    const delta = options.delta ? options.delta : 1;

    const zoomInButton = document.createElement('button');
    zoomInButton.id = 'zoomInButton';
    const zoomInIcon = document.createElement('span');
    zoomInIcon.className = 'icon icon-zoom-in';
    zoomInButton.appendChild(zoomInIcon);
    zoomInButton.setAttribute('title', options.zoomInTipLabel || 'Zoom in');

    const resetZoomButton = document.createElement('button');
    resetZoomButton.id = 'resetZoomButton';
    const resetZoomIcon = document.createElement('span');
    resetZoomIcon.className = 'icon icon-reset';
    resetZoomButton.appendChild(resetZoomIcon);
    resetZoomButton.setAttribute('title', options.resetZoomTipLabel || 'Reset zoom');

    const zoomOutButton = document.createElement('button');
    zoomOutButton.id = 'zoomOutButton';
    const zoomOutIcon = document.createElement('span');
    zoomOutIcon.className = 'icon icon-zoom-out';
    zoomOutButton.appendChild(zoomOutIcon);
    zoomOutButton.setAttribute('title', options.zoomOutTipLabel || 'Zoom out');

    const element = document.createElement('div');
    element.className = 'ol-zoom-controls ol-unselectable ol-control';
    element.appendChild(zoomInButton);
    element.appendChild(resetZoomButton);
    element.appendChild(zoomOutButton);

    super({
      element,
      target: options.target
    });

    zoomInButton.addEventListener(
      EventType.CLICK,
      this.handleClick.bind(this, delta),
      false
    );

    zoomOutButton.addEventListener(
      EventType.CLICK,
      this.handleClick.bind(this, -delta),
      false
    );

    resetZoomButton.addEventListener(
      EventType.CLICK,
      this.handleResetZoom.bind(this),
      false
    );

    this.defaultExtent = options.defaultExtent ? options.defaultExtent : 1;
    this.duration = options.duration ? options.duration : 250;
  }

  handleResetZoom(event) {
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

  /**
   * @param {object} view The view used to determine which zoom actions are active
   * @public
   */
  updateControlState(view) {
    // TODO: Fix this for when screen dimensions are changed, especially wrt default zoom.
    // TODO: Take into account view positioning, so that reset can be used to re-center?

    if (!view) {
      return;
    }
    const currentZoom = view.getZoom();

    if (currentZoom !== undefined) {
      if (currentZoom === view.getZoomForResolution(view.getResolutionForExtent(this.defaultExtent))) {
        document.getElementById('resetZoomButton').disabled = true;
      } else {
        document.getElementById('resetZoomButton').disabled = false;
      }

      if (currentZoom >= view.getMaxZoom()) {
        document.getElementById('zoomInButton').disabled = true;
      } else {
        document.getElementById('zoomInButton').disabled = false;
      }
      if (currentZoom <= view.getMinZoom()) {
        document.getElementById('zoomOutButton').disabled = true;
      } else {
        document.getElementById('zoomOutButton').disabled = false;
      }
    }
  }
}
