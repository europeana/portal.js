export default {
  methods: {
    hideTooltips() {
      console.log('Hiding all tooltips');
      this.$root.$emit('bv::hide::tooltip');
    }
  }
};
