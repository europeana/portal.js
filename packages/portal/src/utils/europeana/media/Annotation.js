import Base from './Base.js';
import TextualBody from './TextualBody.js';

export default class EuropeanaMediaAnnotation extends Base {
  parseData(data) {
    data = super.parseData(data);

    const parsed = {
      id: data.id, // TODO: bloats size of data; how to alleviate?
      body: data.body || data.resource,
      target: data.target || data.on
    };

    if (parsed.body) {
      parsed.body = Array.isArray(parsed.body) ? parsed.body.map((bod) => TextualBody.parse(bod)) : TextualBody.parse(parsed.body);
    }

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
