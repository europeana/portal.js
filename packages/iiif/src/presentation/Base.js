import axios from 'axios';

export default class EuropeanaIIIFPresentationBase {
  id;
  type;
  #url;

  static structure(val) {
    if (Array.isArray(val)) {
      return val.map(this.structure);
    } else if (typeof val === 'object') {
      return new EuropeanaIIIFPresentationBase(val);
    } else {
      return val;
    }
  }

  static isByEuropeana(id) {
    const url = new URL(id);
    return url.origin.endsWith('.europeana.eu') ||
      url.origin.endsWith('.eanadev.org');
  }

  static url(id) {
    return new URL(id);
  }

  constructor(data) {
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
  }

  fetch() {
    return axios.get(this.url);
  }

  get url() {
    return this.constructor.url(this.id);
  }

  get isByEuropeana() {
    return this.constructor.isByEuropeana(this.id);
  }
}
