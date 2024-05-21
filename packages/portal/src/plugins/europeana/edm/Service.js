import Base from './Base.js';

const IIIF_IMAGE_API_URL = 'http://iiif.io/api/image';

export default class Service extends Base {
  get conformsToIIIFImageAPI() {
    return (this.dctermsConformsTo || []).includes(IIIF_IMAGE_API_URL);
  }
}
