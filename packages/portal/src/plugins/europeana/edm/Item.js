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
    return this.aggregations?.find((agg) => agg.about === `/aggregation/provider${this.about}`);
  }

  get iiifPresentationManifest() {
    return this.iiifPresentationManifestForEveryDisplayableWebResource ||
      this.iiifPresentationManifestForWebResourceWithIIIFImageService ||
      null;
  }

  // If the item has one IIIF Presentation manifest web resource (having rdf:type
  // http://iiif.io/api/presentation/3#Manifest), and all of the item's displayable
  // web resources (edm:isShownBy & edm:hasView) may be displayed via that manifest,
  // return the manifest URI.
  get iiifPresentationManifestForEveryDisplayableWebResource() {
    if (this.providerAggregation?.iiifPresentationManifestWebResources?.length === 1) {
      const manifest = this.providerAggregation.iiifPresentationManifestWebResources[0].about;
      if (this.providerAggregation.displayableWebResources.every((wr) => wr.isDisplayableByIIIFPresentationManifest(manifest))) {
        return manifest;
      }
    }

    return null;
  }

  // If the item has a web resource linked to a IIIF Image API service, and
  // that web resource has dcterms:isReferencedBy that is not a IIIF Image info
  // request URI, then assume it is a Presentation Manifest URI, and return it.
  get iiifPresentationManifestForWebResourceWithIIIFImageService() {
    if (this.webResourceWithIIIFImageService?.dctermsIsReferencedBy) {
      return this.webResourceWithIIIFImageService.dctermsIsReferencedBy.find((dctermsIsReferencedBy) => {
        return !this.dctermsIsReferencedByIsImageInfoRequest(dctermsIsReferencedBy);
      });
    }

    return null;
  }

  get webResourceWithIIIFImageService() {
    if (this.hasIIIFImageService) {
      return this.providerAggregation.displayableWebResources.find((wr) => {
        return (wr.svcsHasService || []).includes(this.iiifImageService.about);
      });
    }

    return null;
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
