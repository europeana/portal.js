import Base from '../Base.js';
import Canvas from './Canvas.js';

export default class IIIFPresentationV3Manifest extends Base {
  static MAPPINGS = [
    { as: Canvas, from: 'items', to: 'canvases' }
  ];
}
