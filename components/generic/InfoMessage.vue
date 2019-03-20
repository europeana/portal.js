<template>
  <b-alert
    show
    variant="light"
    data-qa="info notice"
  >
    <i>{{ message }}</i>
  </b-alert>
</template>

<script>
  export default {
    props: {
      message: {
        type: String,
        default: ''
      }
    }
  };
</script>
