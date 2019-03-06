<template>
  <b-alert
    show
    variant="dark"
    data-qa="error notice"
  >
    <strong>Error:</strong> {{ error }}
  </b-alert>
</template>

<script>
  export default {
    props: {
      error: {
        type: String,
        default: ''
      }
    }
  };
</script>
