import Base from './Base.js';

export default class IIIFPresentationService extends Base {
  constructor(data) {
    super(data);

    // profile may be an array containing non-scalar values, which would be
    // skipped by Base.constructor
    this.profile = this.constructor.structure(data.profile);
  }

  get isForIIIFImageAPI() {
    return (this['@context'] || '').includes('://iiif.io/api/image/') ||
      [].concat(this.profile || []).some((prof) => {
        return (typeof prof === 'string') && prof.includes('://iiif.io/api/image/');
      });
  }

  get infoJson() {
    return this.isForIIIFImageAPI ? `${this.id}/info.json` : null;
  }
}
