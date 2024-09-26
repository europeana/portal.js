import EuropeanaMediaBase from './Base.js';

export default class EuropeanaMediaTextualBody extends EuropeanaMediaBase {
  parse(data) {
    data = super.parse(data);

    // preserve original id, e.g. w/ hash
    data.id = this.id || data.id;

    const url = new URL(data.id);

    if (url.hash && data.value) {
      const charSelector = this.getHashParam(url.hash, 'char');
      if (charSelector) {
        const [position, range] = charSelector.split(',');
        data.value = data.value.slice(position, range);
      }
    }

    return data;
  }

  async embed() {
    if (!this.value) {
      await this.fetch();
    }
    return this;
  }
}
