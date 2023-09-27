import Base from '../Base.js';
import Service from './Service.js';

export default class IIIFPresentationV3Image extends Base {
  constructor(data) {
    super(data);

    this.service = data.service && new Service(data.service);
  }
}
