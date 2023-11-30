import Base from './Base.js';
import Service from './Service.js';

export default class IIIFPresentationImage extends Base {
  static MAPPINGS = [
    { as: Service, from: 'service', which: 'first' }
  ];
}
