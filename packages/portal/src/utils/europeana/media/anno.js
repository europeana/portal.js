import EuropeanaMediaBase from './base.js';

export default class EuropeanaMediaAnno extends EuropeanaMediaBase {
  for(target) {
    return [].concat(this.target).map((ownTarget) => {
      if (ownTarget === target) {
        return new EuropeanaMediaAnno({
          ...this,
          target
        });
      } else if (ownTarget.startsWith(`${target}#`)) {
        return new EuropeanaMediaAnno({
          ...this,
          // reduce to just the hash for brevity
          target: ownTarget.replace(target, '')
        });
      } else {
        return null;
      }
    }).filter(Boolean);
  }

  async embedBodies() {
    if (Array.isArray(this.body)) {
      this.body = await Promise.all(this.body.map(this.#embedBody));
    } else {
      this.body = await this.#embedBody(this.body);
    }
    return this;
  }

  async #embedBody(body) {
    if (body.value) {
      return body;
    }
    const id = typeof body === 'string' ? body : body.id;
    const url = new URL(id);
    const hash = url.hash;
    url.hash = ''; // so that axios caching works

    const fullBodyResponse = await this.$axios.get(url.toString());
    // clone to respect reuse of caching, given modification of `value` below
    const fullBody = {
      ...fullBodyResponse.data
    };

    if (hash && fullBody.value) {
      const charSelector = this.getHashParam(hash, 'char');
      if (charSelector) {
        const [position, range] = charSelector.split(',');
        fullBody.value = fullBody.value.slice(position, range);
      }
    }

    return fullBody;
  }

  reduce() {
    const data = {
      id: this.id, // TODO: bloats size of data; how to alleviate?
      value: this.body.value,
      lang: this.body.language
    };

    const xywhSelector = this.getHashParam(this.target, 'xywh');
    if (xywhSelector) {
      [data.x, data.y, data.w, data.h] = xywhSelector
        .split(',')
        .map((xywh) => xywh.length === 0 ? undefined : Number(xywh));
    }

    return data;
  }
}
