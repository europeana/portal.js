export default {
  computed: {
    $hotjarScript() {
      if (this.$config.hotjar && this.$config.hotjar.id && this.$config.hotjar.sv) {
        return { src: `https://static.hotjar.com/c/hotjar-${this.$config.hotjar.id}.js?sv=${this.$config.hotjar.sv}`, async: true };
      }
      return null;
    }
  }
};
