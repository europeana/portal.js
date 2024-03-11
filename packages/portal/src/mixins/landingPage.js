const LANDING_PAGES = {
  ds4ch: 'dataspace-culturalheritage',
  'share-your-data': 'share-your-data'
};

export default {
  data() {
    return {
      landingPageId: this.landingPageIdForRoute({ store: this.$store, route: this.$route })
    };
  },

  methods: {
    landingPageIdForRoute({ route, store }) {
      return Object.keys(LANDING_PAGES).find(key => [store?.state?.microsite?.home, route.params.pathMatch].includes(LANDING_PAGES[key]));
    }
  }
};
