const LANDING_PAGES = {
  ds4ch: 'dataspace-culturalheritage',
  'share-your-data': 'share-your-data'
};

export default {
  data() {
    return {
      landingPageId: this.landingPageIdForRoute(this.$route)
    };
  },

  methods: {
    landingPageIdForRoute(route) {
      return Object.keys(LANDING_PAGES)
        // match on the path with trailing slash for static-generation
        .find(key => [LANDING_PAGES[key], `${LANDING_PAGES[key]}/`, `${LANDING_PAGES[key]}/index.html`].includes(route.params.pathMatch));
    }
  }
};
