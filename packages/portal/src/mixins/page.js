export default {
  watch: {
    pageTitle(val) {
      this.$store.commit('page/setTitle', this.pageTitle);
    }
  }
};
