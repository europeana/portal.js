const LANDING_PAGES = {
  ds4ch: 'dataspace-culturalheritage',
  'share-your-data': 'share-your-data'
};

export default {
  data() {
    return {
      landingPageId: this.landingPageIdForRoute({ $config: this.$config, route: this.$route })
    };
  },

  methods: {
    landingPageIdForRoute({ $config, route } = {}) {
      let identifier = route?.params?.pathMatch;
      if (!identifier && $config?.app?.homeLandingPageSlug) {
        identifier = $config.app.homeLandingPageSlug;
      }

      return Object.keys(LANDING_PAGES).find(key => LANDING_PAGES[key] === identifier);
    }
  }
};
