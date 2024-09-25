export default {
  methods: {
    hideTooltips() {
      this.$root.$emit('bv::hide::tooltip');
    }
  }
};
