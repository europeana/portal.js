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
        }

        if (!this.prefixed) return fieldLabel;

        return this.$t('formatting.labelledValue', { label: this.$tc(`facets.${this.facetName.replace('.', '_')}.name`, 1), value: fieldLabel });
      },

      genericLabel() {
        const unquotedFieldValue = this.fieldValue.replace(/^"(.*)"$/, '$1');
        const key = `facets.${this.facetName}.options.${unquotedFieldValue}`;

        let genericLabel;
        if (this.$te(key)) {
          genericLabel = this.$t(key);
        } else if (this.$te(key, 'en')) {
          genericLabel = this.$t(key, 'en');
        } else {
          genericLabel = unquotedFieldValue;
        }
        return genericLabel;
      },

      mediaTypeLabel() {
        const translated = this.genericLabel;
        if (translated !== this.fieldValue) return translated;

        let subtype = this.fieldValue.split('/')[1];

        return subtype.replace(/^x-/, '').toUpperCase();
      }
    }
  };
</script>
