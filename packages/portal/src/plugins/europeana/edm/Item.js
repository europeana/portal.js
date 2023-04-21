import Agent from './Agent.js';
import Aggregation from './Aggregation.js';
import Base from './Base.js';
import Concept from './Concept.js';
import OreProxy from './OreProxy.js';
import Organization from './Organization.js';
import Service from './Service.js';
import Timespan from './Timespan.js';

export default class Item extends Base {
  static propertyClasses = {
    agents: Agent,
    aggregations: Aggregation,
    concepts: Concept,
    europeanaAggregation: Aggregation,
    organizations: Organization,
    proxies: OreProxy,
    services: Service,
    timespans: Timespan
  };

  constructor(data) {
    super(data);

    // FIXME: not working
    this.meta = new Proxy(this, {
      get(target, prop) {
        return target.proxies.map((proxy) => proxy[prop]);
      }
    });
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

  dctermsIsReferencedByIsImageInfoRequest(dctermsIsReferencedBy) {
    return this.services.some((service) => {
      return service.conformsToIIIFImageAPI && `${service.about}/info.json` === dctermsIsReferencedBy;
    });
  }
}
