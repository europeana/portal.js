import Base from './Base.js';

export default class IIIFPresentationService extends Base {
  static MAPPINGS = [
    { from: 'profile', which: 'first' }
  ];

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
