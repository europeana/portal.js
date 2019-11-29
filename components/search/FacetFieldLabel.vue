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
        MIME_TYPE: 'MIME_TYPE'
      };
    },

    computed: {
      label() {
        const fieldLabel = (this.facetName === this.MIME_TYPE) ? this.mediaTypeLabel : this.genericLabel;

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
      }
    }
  };
</script>
