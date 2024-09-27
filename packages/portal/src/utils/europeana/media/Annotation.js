import Base from './Base.js';
import TextualBody from './TextualBody.js';

export default class EuropeanaMediaAnnotation extends Base {
  parseData(data) {
    data = super.parseData(data);

    const body = Array.isArray(data.body) ? data.body.map((bod) => TextualBody.parse(bod)) : TextualBody.parse(data.body);

    const parsed = {
      id: data.id, // TODO: bloats size of data; how to alleviate?
      body,
      target: data.target
    };

    return parsed;
  }

  targetFor(id) {
    return [].concat(this.target).filter((target) => {
      const targetId = target?.id || target;
      return targetId === id || targetId.startsWith(`${id}#`);
    });
  }

  async embedBodies() {
    if (Array.isArray(this.body)) {
      await Promise.all(this.body.map((body) => body.embed()));
    } else if (this.body) {
      await this.body.embed();
    }
  }
}
