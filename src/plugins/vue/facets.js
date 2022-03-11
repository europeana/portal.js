import themes from '@/plugins/europeana/themes';
import { unescapeLuceneSpecials } from '@/plugins/europeana/utils';

function tFacetName(facetName, count = 1) {
  const collectionLabel = (facetName, count) => {
    const collection = this.$store.getters['search/collection'];
    if (collection) {
      return this.$tcNull(`collections.${collection}.facets.${facetName}.name`, count);
    }
    return null;
  };

  const genericLabel = (facetName, count) => {
    return this.$tcNull(`facets.${facetName}.name`, count);
  };

  const facetNameKey = facetName.replace(/\..*$/, '');
  return collectionLabel(facetNameKey, count) || genericLabel(facetNameKey, count) || facetNameKey;
}

function tFacetOption(facetName, fieldValue, prefixed, escaped) {
  const MIME_TYPE = 'MIME_TYPE';

  const facetFieldLabel = () => {
    const fieldLabel = (facetName === MIME_TYPE) ? mediaTypeLabel() : genericLabel();

    if (!prefixed) {
      return fieldLabel;
    }

    return this.$t('formatting.labelledValue', { label: tFacetName(facetName), value: fieldLabel });
  };

  const genericLabel = () => {
    let fieldLabel = fieldValue;

    if (escaped) {
      fieldLabel = unescapeLuceneSpecials(fieldLabel.replace(/^"(.*)"$/, '$1'));
    }

    if (themeSpecificFieldLabelPattern) {
      fieldLabel = fieldLabel.replace(themeSpecificFieldLabelPattern, '');
    }

    const key = `facets.${facetName}.options.${fieldLabel}`;

    return this.$tNull(key) || fieldLabel;
  };

  function mediaTypeLabel() {
    const translated = genericLabel();
    if (translated !== fieldValue) {
      return translated;
    }

    const subtype = fieldValue.split('/')[1];

    return subtype.replace(/^x-/, '').toUpperCase();
  }

  function themeSpecificFieldLabelPattern() {
    return (theme?.facets || []).find((facet) => facet.field === facetName)?.label;
  }

  function theme() {
    return themes.find(theme => theme.qf === collection);
  }

  const collection = this.$store.getters['search/collection'];

  return facetFieldLabel();
}

export default {
  install(Vue) {
    Vue.prototype.$tFacetName = tFacetName;
    Vue.prototype.$tFacetOption = tFacetOption;
  }
};
