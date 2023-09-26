import Base from '../Base.js';

export default class IIIFPresentationV3Annotation extends Base {
  constructor(data) {
    super(data);
    this.body = new Base(data.body);
  }
}
