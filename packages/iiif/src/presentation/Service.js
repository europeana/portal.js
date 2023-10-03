import Base from './Base.js';

export default class IIIFPresentationService extends Base {
  get isForIIIFImageAPI() {
    // TODO: profile may be an array
    return (this.protocol === 'http://iiif.io/api/image') ||
      this.profile?.includes('://iiif.io/api/image/');
  }

  get infoJson() {
    return this.isForIIIFImageAPI ? `${this.id}/info.json` : null;
  }
}
