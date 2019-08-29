<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    data-qa="oembed media container"
    v-html="html"
  />
  <!-- eslint-enable vue/no-v-html -->
</template>

<script>
  export default {
    name: 'VideoPlayer',

    props: {
      html: {
        type: String,
        required: true
      }
    }
  };
</script>
