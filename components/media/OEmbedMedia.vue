<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    v-if="oEmbedData && oEmbedData.html"
    data-qa="oembed media container"
    v-html="oEmbedData.html"
  />
  <AlertMessage
    v-else-if="oEmbedData && 'error' in oEmbedData"
    :error="oEmbedData.error"
  />
  <!-- eslint-enable vue/no-v-html -->
</template>

<script>
  import AlertMessage from '../../components/generic/AlertMessage';

  export default {
    name: 'OEmbedMedia',
    components: {
      AlertMessage
    },
    props: {
      oEmbedData: {
        type: Object,
        required: true
      }
    }
  };
</script>
