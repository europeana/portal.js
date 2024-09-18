import { Control } from 'ol/control.js';

export default class ResetZoomControl extends Control {
  /**
   * @param {Object} [options] Control options.
   */
  constructor(options = {}) {
    const button = document.createElement('button');
    button.innerHTML = options.label || '=';
    button.setAttribute('title', options.tipLabel || 'Reset zoom');

    const element = document.createElement('div');
    element.className = 'ol-reset-zoom ol-unselectable ol-control';
    element.appendChild(button);

    super({
      element,
      target: options.target
    });

    button.addEventListener('click', this.handleResetZoom.bind(this), false);
  }

  handleResetZoom() {
    // TODO: should this instead reset the zoom to the original
    //       fitted-to-container extent?
    this.getMap().getView().setZoom(1);
  }
}
