import Base from './Base.js';
import Service from './Service.js';

export default class IIIFPresentationImage extends Base {
  constructor(data) {
    super(data);

    this.service = data.service && new Service([].concat(data.service)[0]);
  }
}
