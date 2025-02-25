import Base from './Base.js';
import { IIIFInfoJsonError } from './errors.js';
import EDMService from '@/plugins/europeana/edm/Service.js';

export default class EuropeanaMediaService extends Base {
  #edm;

  static fromEDM(edm) {
    if (!edm) {
      return undefined;
    }

    let data = {};
    if (typeof edm === 'string') {
      data.id = edm;
    } else {
      data = this.omitIsUndefined({
        context: 'http://iiif.io/api/image/2/context.json',
        id: edm.about,
        profile: edm.doapImplements
      });
    }

    const service = new this(data);
    service.edm = edm;
    return service;
  }

  get infoUrl() {
    return `${this.id}/info.json`;
  }

  async fetchInfo() {
    try {
      const response = await this.constructor.fetch({
        url: this.infoUrl
      });
      return response;
    } catch (e) {
      const error = new IIIFInfoJsonError(e.message);
      error.url = e.config?.url;
      throw error;
    }
  }

  get edm() {
    if (!this.#edm) {
      const data = this.constructor.omitIsUndefined({
        about: this.id,
        doapImplements: this.profile,
        dctermsConformsTo: ['http://iiif.io/api/image']
      });

      this.#edm = new EDMService(data);
    }
    return this.#edm;
  }

  set edm(value) {
    this.#edm = value;
  }
}
