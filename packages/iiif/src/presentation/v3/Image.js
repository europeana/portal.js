import Base from '../Base.js';
import Service from './Service.js';

export default class EuropeanaIIIFPresentationV3Image extends Base {
  constructor(data) {
    super(data);

    this.service = new Service(data.service);
  }
}
