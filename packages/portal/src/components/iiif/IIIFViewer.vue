<template>
  <div
    class="iiif-viewer-inner-wrapper h-100 d-flex flex-column"
  >
    {{ uri }}
  </div>
</template>

<script>
  export default {
    name: 'IIIFViewer',

    components: {
      IIIFErrorMessage: () => import('./IIIFErrorMessage.vue')
    },

    props: {
      uri: {
        type: String,
        required: true
      },

      itemId: {
        type: String,
        default: null
      },

      searchQuery: {
        type: String,
        default: null
      },

      providerUrl: {
        type: String,
        default: null
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/iiif';

  .iiif-viewer-inner-wrapper {
    background-color: $black;

    &.error {
      overflow: auto;
    }
  }
</style>
