<template>
  <div v-html="html" />
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
