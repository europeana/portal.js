import { IIIF_IMAGE_API_URL } from '../iiif/index.js';
import Base from './Base.js';

export default class Service extends Base {
  get conformsToIIIFImageAPI() {
    return (this.dctermsConformsTo || []).includes(IIIF_IMAGE_API_URL);
  }
}
