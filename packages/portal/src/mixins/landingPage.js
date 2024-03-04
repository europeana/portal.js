const LANDING_PAGES = {
  ds4ch: 'microsite/DS4CH.eu',
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
      return Object.keys(LANDING_PAGES).find(key => LANDING_PAGES[key] === route.params.pathMatch);
    }
  }
};
