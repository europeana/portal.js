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
      },

      escaped: {
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
        return this.$tFacetOption(this.facetName, this.fieldValue, this.prefixed, this.escaped);
      }
    }
  };
</script>
