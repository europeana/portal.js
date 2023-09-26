import Base from '../Base.js';

export default class IIIFPresentationEuropeanaFullTextResource extends Base {
  constructor(data) {
    super(data);

    if (this.url.hash.startsWith('#char=')) {
      const charMatch = this.url.hash.match(/^#char=(\d+),(\d+)$/);
      this.value = this.value.slice(
        Number(charMatch[1]), Number(charMatch[2]) + 1
      );
    }
  }
}
