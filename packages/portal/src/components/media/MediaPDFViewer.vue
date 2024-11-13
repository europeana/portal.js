<template>
  <div class="w-100 h-100 overflow-hidden">
    <iframe
      title="pdf-viewer"
      :src="`https://docs.google.com/viewer?url=${src}&embedded=true`"
      class="w-100 h-100 border-0"
    />
  </div>
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
