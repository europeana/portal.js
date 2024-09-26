import Base from './Base.js';
import TextualBody from './TextualBody.js';

export default class EuropeanaMediaAnnotation extends Base {
  targetFor(id) {
    return [].concat(this.target).filter((target) => {
      return target === id || target.startsWith(`${id}#`);
    });
  }

  async embedBodies() {
    if (Array.isArray(this.body)) {
      await Promise.all(this.body.map((body) => body.embed()));
    } else if (this.body) {
      await this.body.embed();
    }
  }

  parse(data) {
    data = super.parse(data);

    const body = Array.isArray(data.body) ? data.body.map(new TextualBody) : new TextualBody(data.body);

    const parsed = {
      id: data.id, // TODO: bloats size of data; how to alleviate?
      body,
      target: data.target
    };

    return parsed;
  }
}
