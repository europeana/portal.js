import Base from '../Base.js';
import Image from '../Image.js';

export default class IIIFPresentationV2Canvas extends Base {
  constructor(data) {
    super(data);

    const images = [].concat(data.images || []);
    const resources = images.map((img) => img.resource)
      .filter((res) => res?.['@type'] === 'dctypes:Image');
    this.images = resources.map((res) => new Image(res));

    // TODO: annotation pages

    this.thumbnail = [].concat(data.thumbnail || [])
      .filter((thumb) => thumb['@type'] === 'dctypes:Image')
      .map((thumb) => new Image(thumb))[0];
  }
}
