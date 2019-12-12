<template>
  <span>
    {{ label }}
  </span>
</template>

<script>
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

        let fieldLabel = this.genericLabel;

        if (this.facetName === this.MIME_TYPE) {
          fieldLabel = this.mediaTypeLabel;
        } else if (this.facetName === this.DATE) {
          fieldLabel = this.dateLabel;
        }

        if (!this.prefixed) return fieldLabel;

        return this.$t('formatting.labelledValue', { label: this.$tc(`facets.${this.facetName}.name`, 1), value: fieldLabel });
      },

      genericLabel() {
        const key = `facets.${this.facetName}.options.${this.fieldValue}`;

        return this.$te(key) ? this.$t(key) : this.fieldValue;
      },

      mediaTypeLabel() {
        const translated = this.genericLabel;
        if (translated !== this.fieldValue) return translated;

        let subtype = this.fieldValue.split('/')[1];

        return subtype.replace(/^x-/, '').toUpperCase();
      },

      dateLabel() {
        const dateRegEx = /(\d{4}([-])\d{2}([-])\d{2})/g;
        const value = this.fieldValue.match(re);

        if (value[0] === value[1]) {
          return `[${value[0]}]`;
        }

        return this.fieldValue;
      }
    }
  };
</script>
