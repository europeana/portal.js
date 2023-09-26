import Base from '../Base.js';
import Service from './Service.js';

export default class IIIFPresentationV2Image extends Base {
  constructor(data) {
    super(data);

    this.service = new Service(data.service);
  }
}
