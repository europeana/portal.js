import Base from './Base.js';
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
        id: edm.about,
        profile: edm.doapImplements,
        dctermsConformsTo: [].concat(edm.dctermsConformsTo)[0]
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
    const response = await this.constructor.fetch({
      url: this.infoUrl
    });
    return response;
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
