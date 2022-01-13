<template>
  <span>
    {{ label }}
  </span>
</template>

<script>
  import { mapGetters } from 'vuex';
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

      truncate: {
        type: Number,
        default: -1
      }
    },

    data() {
      return {
        MIME_TYPE: 'MIME_TYPE',
        DATE: 'proxy_dcterms_issued'
      };
    },

    computed: {
      ...mapGetters({
        formatFacetFieldLabel: 'search/formatFacetFieldLabel'
      }),

      label() {
        let fieldLabel = (this.facetName === this.MIME_TYPE) ? this.mediaTypeLabel : this.genericLabel;

        if (this.truncate > -1) {
          fieldLabel = this.$options.filters.truncate(fieldLabel, this.truncate);
        }

        if (!this.prefixed) {
          return fieldLabel;
        }

        return this.$t('formatting.labelledValue', { label: this.$tFacetName(this.facetName), value: fieldLabel });
      },

      genericLabel() {
        let fieldLabel;

        fieldLabel = this.formatFacetFieldLabel(this.facetName, this.fieldValue);
        if (!fieldLabel) {
          fieldLabel = this.fieldValue;
        }

        const unquotedFieldValue = unescapeLuceneSpecials(fieldLabel.replace(/^"(.*)"$/, '$1'));

        const key = `facets.${this.facetName}.options.${unquotedFieldValue}`;

        return this.$tNull(key) || unquotedFieldValue;
      },

      mediaTypeLabel() {
        const translated = this.genericLabel;
        if (translated !== this.fieldValue) {
          return translated;
        }

        const subtype = this.fieldValue.split('/')[1];

        return subtype.replace(/^x-/, '').toUpperCase();
      }
    }
  };
</script>
