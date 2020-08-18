<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    v-if="html"
    data-qa="html embed"
    class="mb-5 html-embed"
    v-html="html"
  />
  <AlertMessage
    v-else-if="error"
    :error="error"
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
      html: {
        type: String,
        default: ''
      },
      error: {
        type: String,
        default: ''
      }
    }
  };
</script>
