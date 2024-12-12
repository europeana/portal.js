<template>
  <iframe
    :src="src"
    class="w-100 h-100"
    title="PDF"
  />
</template>

<script>
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
    }
  };
</script>
