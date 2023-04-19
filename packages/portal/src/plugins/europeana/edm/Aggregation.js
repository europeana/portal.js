import WebResource from './WebResource.js';

export default class Aggregation {
  constructor(edm, itemId) {
    for (const field in edm) {
      if (field === 'webResources') {
        this[field] = edm[field].map((wrEdm) => new WebResource(wrEdm, itemId));
      } else {
        this[field] = edm[field];
      }
    }
  }

  get iiifPresentationManifestWebResources() {
    return this.webResources.filter((wr) => wr.isIIIFPresentationManifest);
  }

  // TODO: should this include edm:isShownAt? (for oEmbeds)
  get displayableWebResources() {
    return this.webResources.filter((wr) => (wr.about === this.edmIsShownBy) || this.hasView?.includes(wr.about));
  }
}
