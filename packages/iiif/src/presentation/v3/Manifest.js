import Base from '../Base.js';
import Canvas from './Canvas.js';

export default class IIIFPresentationV3Manifest extends Base {
  constructor(data) {
    super(data);

    this.canvases = data.items.map((cnv) => new Canvas(cnv));
  }
}
