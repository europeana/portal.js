import Base from '../Base.js';
import Image from './Image.js';

export default class EuropeanaIIIFPresentationV2Canvas extends Base {
  constructor(data) {
    super(data);

    const images = [].concat(data.images || []);
    const resources = images.map((img) => img.resource)
      .filter((res) => res?.['@type'] === 'dctypes:Image');
    this.images = resources.map((res) => new Image(res));
  }
}
