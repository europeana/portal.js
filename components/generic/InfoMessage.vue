<template>
  <b-alert
    show
    variant="light"
    data-qa="info notice"
  >
    {{ message }}
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

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";

  .alert.alert-light {
    font-style: italic;
  }

  .alert-light {
    color: $black;
  }
</style>
