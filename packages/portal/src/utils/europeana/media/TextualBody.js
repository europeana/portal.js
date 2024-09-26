import EuropeanaMediaBase from './Base.js';

export default class EuropeanaMediaTextualBody extends EuropeanaMediaBase {
  parse(data) {
    data = super.parse(data);

    const parsed = {
      // preserve original id, e.g. w/ hash
      id: this.id || data.id,
      value: data.value || data.chars,
      language: data.language
    };

    if (parsed.id) {
      const url = new URL(parsed.id);

      if (url.hash && parsed.value) {
        const charSelector = this.getHashParam(url.hash, 'char');
        if (charSelector) {
          const [position, range] = charSelector.split(',');
          parsed.value = parsed.value.slice(position, range);
        }
      }
    }

    return parsed;
  }

  async embed() {
    if (!this.value) {
      await this.fetch();
    }
    return this;
  }
}
