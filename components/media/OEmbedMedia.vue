<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    v-if="oEmbedData"
    data-qa="oembed media container"
    v-html="oEmbedData.html"
  />
  <!-- eslint-enable vue/no-v-html -->
</template>

<script>
  export default {
    name: 'OEmbedMedia',

    props: {
      oEmbedData: {
        type: Object,
        required: true
      }
    }
  };
</script>
