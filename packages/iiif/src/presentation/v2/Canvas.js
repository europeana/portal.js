import Base from '../Base.js';
import Image from '../Image.js';

export default class IIIFPresentationV2Canvas extends Base {
  static MAPPINGS = [
    { as: Image, filter: (thumb) => thumb.type === 'dctypes:Image', from: 'thumbnail', which: 'first' },
    { as: Image, filter: (image) => image.type === 'dctypes:Image', from: 'images.resource', to: 'images', which: 'all' }
    // TODO: annotation pages
  ];
}
