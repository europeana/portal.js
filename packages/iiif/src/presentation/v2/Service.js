import Base from '../Base.js';

export default class IIIFPresentationV2Service extends Base {
  get infoJson() {
    return this.profile?.includes('://iiif.io/api/image/') ? `${this.id}/info.json` : null;
  }
}
