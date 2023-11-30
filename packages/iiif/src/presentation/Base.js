import fetchResource from '../utils/fetch.js';
import { isInEuropeanaDomain } from '../utils/url.js';

export default class IIIFPresentationBase {
  static MAPPINGS = [];
  id;
  type;

  static isInEuropeanaDomain(id) {
    return isInEuropeanaDomain(id);
  }

  static url(id) {
    return new URL(id);
  }

  static fetch(url, options = {}) {
    return fetchResource(url, options);
  }

  constructor(data) {
    if (typeof data === 'object') {
      this.initData(data);
      this.applyMappings(data);
    } else {
      this.id = data;
    }
  }

  initData(data) {
    const normalised = this.normaliseData(data);
    for (const prop in normalised) {
      this[prop] = normalised[prop];
    }
  }

  normaliseData(data) {
    if (Array.isArray(data)) {
      data = data.map((elm) => this.normaliseData(elm));
    } else if (typeof data === 'object') {
      for (const prop in data) {
        const val = data[prop];

        // normalise id and type
        if (['@id', '@type'].includes(prop)) {
          data[prop.slice(1)] = val;
        } else {
          data[prop] = this.normaliseData(val);
        }
      }
    }

    return data;
  }

  applyMappings(data) {
    for (const mapping of this.constructor.MAPPINGS) {
      const from = mapping.from.split('.');
      let source = data;
      let fromProp;
      while (from.length > 0) {
        fromProp = from.shift();
        source = [source].flat().map((elm) => elm[fromProp]).filter((elm) => elm !== undefined).flat();
      }
      if (source) {
        const mapped = source
          .filter((elm) => !mapping.filter || mapping.filter(elm))
          .map((elm) => mapping.as ? new mapping.as(elm) : this.normaliseData(elm));
        this[mapping.to || mapping.from] = (mapping.which === 'first') ? mapped[0] : mapped;
      }
    }
  }

  fetch(options = {}) {
    return this.constructor.fetch(this.url, options);
  }

  get url() {
    return this.constructor.url(this.id);
  }

  get isInEuropeanaDomain() {
    return this.constructor.isInEuropeanaDomain(this.id);
  }
}
