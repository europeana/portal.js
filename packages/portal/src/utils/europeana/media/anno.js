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
  }

  async #embedBody(body) {
    if (body.value) {
      return body;
    }
    const id = typeof body === 'string' ? body : body.id;
    const url = new URL(id);
    const hash = url.hash;
    url.hash = ''; // so that caching works

    const fullBodyResponse = await this.$axios.get(url.toString());
    // clone to respect reuse of caching, given modification of value below
    const fullBody = {
      ...fullBodyResponse.data
    };

    if (hash && fullBody.value) {
      const fragment = new URLSearchParams(hash.slice(1));
      const charSelector = fragment.get('char');
      if (charSelector) {
        const [position, range] = charSelector.split(',');
        fullBody.value = fullBody.value.slice(position, range);
      }
    }

    return fullBody;
  }
}
