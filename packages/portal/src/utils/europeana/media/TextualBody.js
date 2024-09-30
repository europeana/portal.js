import Base from './Base.js';

export default class EuropeanaMediaTextualBody extends Base {
  parseData(data) {
    data = super.parseData(data);

    const parsed = {
      id: data.id,
      value: data.value || data.chars,
      language: data.language
    };

    if (parsed.id) {
      const url = new URL(parsed.id);

      // TODO: will value always be full at this point, or may it already be sliced?
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
      const response = await this.fetch();
      this.parse(response.data);
    }
    return this;
  }
}
