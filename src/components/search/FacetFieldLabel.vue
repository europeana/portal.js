<template>
  <span>
    {{ label }}
  </span>
</template>

<script>
  import themes from '@/plugins/europeana/themes';
  import { unescapeLuceneSpecials } from '@/plugins/europeana/utils';

  export default {
    name: 'FacetFieldLabel',

    props: {
      facetName: {
        type: String,
        required: true
      },

      fieldValue: {
        type: String,
        required: true
      },

      prefixed: {
        type: Boolean,
        default: false
      },

      escaped: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        MIME_TYPE: 'MIME_TYPE',
        DATE: 'proxy_dcterms_issued'
      };
    },

    computed: {
      label() {
        const fieldLabel = (this.facetName === this.MIME_TYPE) ? this.mediaTypeLabel : this.genericLabel;

        if (!this.prefixed) {
          return fieldLabel;
        }

        return this.$t('formatting.labelledValue', { label: this.$tFacetName(this.facetName), value: fieldLabel });
      },

      genericLabel() {
        let fieldLabel = this.fieldValue;

        if (this.escaped) {
          fieldLabel = unescapeLuceneSpecials(fieldLabel.replace(/^"(.*)"$/, '$1'));
        }

        if (this.themeSpecificFieldLabelPattern) {
          fieldLabel = fieldLabel.replace(this.themeSpecificFieldLabelPattern, '');
        }

        const key = `facets.${this.facetName}.options.${fieldLabel}`;

        return this.$tNull(key) || fieldLabel;
      },

      mediaTypeLabel() {
        const translated = this.genericLabel;
        if (translated !== this.fieldValue) {
          return translated;
        }

        const subtype = this.fieldValue.split('/')[1];

        return subtype.replace(/^x-/, '').toUpperCase();
      },

      collection() {
        return this.$store.getters['search/collection'];
      },

      theme() {
        return themes.find(theme => theme.qf === this.collection);
      },

      themeSpecificFieldLabelPattern() {
        return (this.theme?.facets || []).find((facet) => facet.field === this.facetName)?.label;
      }
    }
  };
</script>
