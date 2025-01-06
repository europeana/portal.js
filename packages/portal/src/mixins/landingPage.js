const LANDING_PAGES = {
  apis: 'apis',
  ds4ch: 'dataspace-culturalheritage',
  'share-your-collections': 'share-your-collections'
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
