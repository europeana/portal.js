import Base from '../Base.js';
import Canvas from './Canvas.js';

export default class IIIFPresentationV2Manifest extends Base {
  constructor(data) {
    super(data);

    const sequences = [].concat(data.sequences || []);
    const canvases = sequences.map((seq) => seq.canvases).flat();
    this.canvases = canvases.map((cnv) => new Canvas(cnv));
  }
}
