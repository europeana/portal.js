import fetchResource from '../utils/fetch.js';
import { isInEuropeanaDomain } from '../utils/url.js';

export default class IIIFPresentationBase {
  id;
  type;

  static structure(val) {
    if (Array.isArray(val)) {
      return val.map(this.structure);
    } else if (typeof val === 'object') {
      return new IIIFPresentationBase(val);
    } else {
      return val;
    }
  }

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
      for (const prop in data) {
        const val = data[prop];

        // normalise id and type
        if (['@id', '@type'].includes(prop)) {
          this[prop.slice(1)] = val;
        } else {
          let keep = false;
          // only keep scalar properties, and arrays of scalars. if others are wanted,
          // add in sub-class constructors
          if (typeof val !== 'object') {
            keep = true;
          } else if (Array.isArray(val) && val.every((elm) => typeof elm !== 'object')) {
            keep = true;
          }

          if (keep) {
            this[prop] = this.constructor.structure(val);
          }
        }
      }
    } else {
      this.id = data;
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
