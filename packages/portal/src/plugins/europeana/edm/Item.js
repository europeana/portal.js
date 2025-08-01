import Base from './Base.js';
import Aggregation from './Aggregation.js';
import Service from './Service.js';

export default class Item extends Base {
  static propertyClasses = {
    aggregations: Aggregation,
    services: Service
  };

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

  get webResourceForIIIFPresentationManifest() {
    if (this.iiifPresentationManifestForEveryDisplayableWebResource) {
      return this.providerAggregation.displayableWebResources[0];
    } else if (this.iiifPresentationManifestForWebResourceWithIIIFImageService) {
      return this.webResourceWithIIIFImageService;
    }

    return null;
  }

  get hasIIIFImageService() {
    return !!this.iiifImageService;
  }

  get iiifImageService() {
    return (this.services || []).find((service) => service.conformsToIIIFImageAPI);
  }

  get isDeleted() {
    const changeLog = this.europeanaAggregation.changeLog || [];
    const lastChange = changeLog[changeLog.length - 1];
    return lastChange?.type === 'Delete';
  }

  dctermsIsReferencedByIsImageInfoRequest(dctermsIsReferencedBy) {
    return this.services.some((service) => {
      return service.conformsToIIIFImageAPI && `${service.about}/info.json` === dctermsIsReferencedBy;
    });
  }
}
