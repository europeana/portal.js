<template>
  <p
    v-if="isPDF"
  >
    <b-link
      :href="url"
      target="_blank"
    >
      View PDF
    </b-link>
  </p>
</template>

<script>
  export default {
    props: {
      url: {
        type: String,
        default: ''
      },
      mimeType: {
        type: String,
        default: ''
      }
    },
    computed: {
      isPDF: function() {
        return this.mimeType == 'application/pdf';
      }
    }
  };
</script>
