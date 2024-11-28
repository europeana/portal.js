<template>
  <div
    id="media-pdf-viewer"
    class="w-100 h-100 overflow-hidden"
  />
</template>

<script>
  import PDFObject from 'pdfobject';

  export default {
    name: 'MediaPDFViewer',

    props: {
      url: {
        type: String,
        required: true
      },

      itemId: {
        type: String,
        default: null
      }
    },

    computed: {
      src() {
        return this.$apis.record.mediaProxyUrl(this.url, this.itemId, { disposition: 'inline' });
      }
    },

    mounted() {
      // TODO: set custom fallback message: https://pdfobject.com/api/#fallbacklink

      PDFObject.embed(this.src, '#media-pdf-viewer');
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  #media-pdf-viewer {
    ::v-deep p {
      color: $white;

      a {
        color: $white;
      }
    }
  }
</style>
