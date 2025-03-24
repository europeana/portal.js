export default {
  data() {
    return {
      contentfulExtensionSdk: null,
      entry: null,
      message: null
    };
  },

  mounted() {
    window.contentfulExtension.init((sdk) => {
      this.contentfulExtensionSdk = sdk;
      if (sdk.location.is(window.contentfulExtension.locations.LOCATION_ENTRY_SIDEBAR)) {
        sdk.window.startAutoResizer();

        this.entry = sdk.entry;
      }
    });
  },

  methods: {
    showError(message, error) {
      if (error?.message) {
        console.error(error.message);
      }
      this.contentfulExtensionSdk.dialogs.openAlert({
        title: 'Error',
        message
      });
      this.message = 'Failed';
    }
  }
};
