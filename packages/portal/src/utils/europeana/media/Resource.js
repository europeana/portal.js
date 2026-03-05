import Base from './Base.js';
import Service from './Service.js';
import EDMWebResource from '@/plugins/europeana/edm/WebResource.js';

export default class EuropeanaMediaResource extends Base {
  #edm;

  static fromEDM(edm, services = []) {
    if (!edm) {
      return undefined;
    }

    const serviceId = [].concat(edm.svcsHasService)[0];
    const service = (services || []).find((edmService) => edmService.about === serviceId);

    let data = {};
    if (typeof edm === 'string') {
      data.id = edm;
    } else {
      data = this.omitIsUndefined({
        id: edm.about,
        format: edm.ebucoreHasMimeType,
        height: edm.ebucoreHeight,
        width: edm.ebucoreWidth,
        service: Service.fromEDM(service)
      });
    }

    const resource = new this(data);
    resource.edm = edm;
    return resource;
  }

  parseData(data) {
    data = super.parseData(data);

    const parsed = {
      id: data.id,
      format: data.format,
      height: data.height,
      service: Service.parse([].concat(data.service)[0]),
      width: data.width
    };

    return parsed;
  }

  get edm() {
    if (!this.#edm) {
      const data = this.constructor.omitIsUndefined({
        about: this.id,
        ebucoreHasMimeType: this.format,
        ebucoreHeight: this.height,
        ebucoreWidth: this.width,
        svcsHasService: [].concat(this.service || [])[0]?.edm
      });

      this.#edm = new EDMWebResource(data);
    }
    return this.#edm;
  }

  get isOEmbed() {
    return this.service?.dctermsConformsTo === 'https://oembed.com/';
  }

  set edm(value) {
    this.#edm = value;
  }
}
