import Vue from 'vue';

const MIME_TYPE = 'MIME_TYPE';

const plugin = {
  install() {
    Vue.prototype.$localiseFilterLabel = function(facetName, filterLabel) {
      if (facetName === MIME_TYPE) {
        return this.$localiseMediaType(filterLabel);
      }
      return this.$localiseGenericFacetFilter(facetName, filterLabel);
    };

    Vue.prototype.$localiseGenericFacetFilter = function(facetName, filterLabel) {
      const key = `facets.${facetName}.options.${filterLabel}`;
      return this.$te(key) ? this.$t(key) : filterLabel;
    };

    Vue.prototype.$localiseMediaType = function(mediaType) {
      const translated = this.$localiseGenericFacetFilter(MIME_TYPE, mediaType);
      if (translated !== mediaType) return translated;

      let subtype = mediaType.split('/')[1];

      return subtype.replace(/^x-/, '').toUpperCase();
    };
  }
};

Vue.use(plugin);

/*
 * Adds the isoLocale function to i18n.
 * Used to lookup the iso code for the currently selected locale.
 */
export default ({ app }) => {
  const locales = app.i18n.locales;
  // Set the function directly on the context.app object
  app.i18n.isoLocale = function() {
    return locales.find(locale => locale.code === app.i18n.locale)['iso'];
  };
};
