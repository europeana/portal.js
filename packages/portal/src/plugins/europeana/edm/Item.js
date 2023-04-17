import Aggregation from './Aggregation.js';
import Service from './Service.js';

export default class Item {
  constructor(edm) {
    for (const field in edm) {
      if (field === 'aggregations') {
        this[field] = edm[field].map((wrEdm) => new Aggregation(wrEdm, edm.about));
      } else if (field === 'services') {
        this[field] = edm[field].map((serviceEdm) => new Service(serviceEdm));
      } else {
        this[field] = edm[field];
      }
    }
  }

  get providerAggregation() {
    return this.aggregations.find((agg) => agg.about === `/aggregation/provider${this.about}`);
  }

  get iiifPresentationManifest() {
    let manifest = null;

    if (
      (this.providerAggregation.iiifPresentationManifestWebResources.length === 1) &&
      (this.providerAggregation.displayableWebResources.every((wr) => {
        return wr.isDisplayableByIIIFPresentationManifest(this.providerAggregation.iiifPresentationManifestWebResources[0].about);
      }))
    ) {
      manifest = this.providerAggregation.iiifPresentationManifestWebResources[0].about;
    } else if (this.webResourceWithIIIFImageService?.dctermsIsReferencedBy) {
      manifest = this.webResourceWithIIIFImageService.dctermsIsReferencedBy.find((dctermsIsReferencedBy) => {
        return !this.dctermsIsReferencedByIsImageInfoRequest(dctermsIsReferencedBy);
      }) || null;
    }

    return manifest;
  }

  get webResourceWithIIIFImageService() {
    return this.providerAggregation.displayableWebResources.find((wr) => {
      return (wr.svcsHasService || []).includes(this.iiifImageService.about);
    });
  }

  get hasIIIFImageService() {
    return !!this.iiifImageService;
  }

  get iiifImageService() {
    return (this.services || []).find((service) => service.conformsToIIIFImageAPI);
  }

  dctermsIsReferencedByIsImageInfoRequest(dctermsIsReferencedBy) {
    return this.services.some((service) => {
      return service.conformsToIIIFImageAPI && `${service.about}/info.json` === dctermsIsReferencedBy;
    });
  }
}
