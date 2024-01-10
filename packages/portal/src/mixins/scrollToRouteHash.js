export default {
  data() {
    return {
      scrollToRouteHashRef: 'pageHeader'
    };
  },

  mounted() {
    this.scrollToRouteHash();
  },

  methods: {
    // same thing that browsers do anyway, but taking into account that the
    // static page header will obscure the top of the element in question
    //
    // TODO: ideally this should also be called when using client-side navigation,
    //       not just when is first mounted, e.g. to handle hash
    //       properly when using back/forward. however, some of the elements
    //       may load late due to api requests, so how to do so?
    scrollToRouteHash() {
      if (this.$route.hash) {
        this.$scrollTo?.(this.$route.hash, {
          duration: 0,
          easing: 'linear',
          offset: -this.$refs[this.scrollToRouteHashRef]?.$el?.clientHeight || 0
        });
      }
    }
  }
};
