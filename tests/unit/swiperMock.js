// Used by Jest to mock ESM Swiper
export default class Swiper {
  constructor(element) {
    this.element = element;
  }
  slideTo() {
    return {};
  }
  update() {
    return {};
  }
}
