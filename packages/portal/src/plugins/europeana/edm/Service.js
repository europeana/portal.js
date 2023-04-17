import { IIIF_IMAGE_API_URL } from '../iiif/index.js';

export default class Service {
  constructor(edm) {
    for (const field in edm) {
      this[field] = edm[field];
    }
  }

  get conformsToIIIFImageAPI() {
    return (this.dctermsConformsTo || []).includes(IIIF_IMAGE_API_URL);
  }
}
