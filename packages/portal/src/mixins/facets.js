import themes from '@/plugins/europeana/themes';
import { unescapeLuceneSpecials } from '@europeana/utils';

const translateWithFallbackOrNull = (scope, key, callback) => {
  let translation = null;

  // Needed because VueI18n's $te function does not take into account the fallback
  // locale, i.e. is always false if the active locale does not have the key.
  if (scope.$te(key)) {
    translation = callback(null);
  } else if (scope.$i18n.locale !== scope.$i18n.fallbackLocale) {
    if (scope.$te(key, scope.$i18n.fallbackLocale)) {
      translation = callback(scope.$i18n.fallbackLocale);
    }
  }

  return translation;
};

export default {
  methods: {
    // I18n function to localise into active locale if translation exists, else
    // into app fallback locale, else return null.
    tNull(key, values) {
      return translateWithFallbackOrNull(this, key, (locale) => this.$t(key, locale, values));
    },

    // I18n pluralisation function to localise into active locale if translation
    // exists, else into app fallback locale, else return null.
    tcNull(key, count, values) {
      return translateWithFallbackOrNull(this, key, (locale) => this.$tc(key, count, locale, values));
    },

    tFacetKey(facetName, key, { count = 1, collection = null } = {}) {
      const facetNameKey = facetName.split('.')[0];

      if (collection) {
        const collectionLabel = this.tcNull(`collections.${collection}.facets.${facetNameKey}.${key}`, count);
        if (collectionLabel) {
          return collectionLabel;
        }
      }

      const genericLabel = this.tcNull(`facets.${facetNameKey}.${key}`, count);

      return genericLabel || facetNameKey;
    },

    tFacetName(facetName, { count = 1, collection = null } = {}) {
      return this.tFacetKey(facetName, 'name', { count, collection });
    },

    tFacetOption(facetName, fieldValue, { escaped = false, collection = null } = {}) {
      const MIME_TYPE = 'MIME_TYPE';

      const selectedTheme = themes.find((theme) => theme.qf === collection);
      const themeSpecificFieldLabelPattern = (selectedTheme?.facets || []).find((facet) => facet.field === facetName)?.label;

      const genericLabel = () => {
        let fieldLabel = fieldValue;

        if (escaped) {
          fieldLabel = unescapeLuceneSpecials(fieldLabel.replace(/^"(.*)"$/, '$1'));
        }

        if (themeSpecificFieldLabelPattern) {
          fieldLabel = fieldLabel.replace(themeSpecificFieldLabelPattern, '');
        }

        const key = `facets.${facetName}.options.${fieldLabel}`;

        return this.tNull(key) || fieldLabel;
      };

      const mediaTypeLabel = () => {
        const translated = genericLabel();
        if (translated !== fieldValue) {
          return translated;
        }

        const subtype = fieldValue.split('/')[1];

        return subtype.replace(/^x-/, '').toUpperCase();
      };

      return (facetName === MIME_TYPE) ? mediaTypeLabel() : genericLabel();
    }
  }
};
