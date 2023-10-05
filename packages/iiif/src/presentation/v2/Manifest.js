import Base from '../Base.js';
import Canvas from './Canvas.js';

export default class IIIFPresentationV2Manifest extends Base {
  static MAPPINGS = [
    { as: Canvas, from: 'sequences.canvases', to: 'canvases', which: 'all' }
  ];
}
