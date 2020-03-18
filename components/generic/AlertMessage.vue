<template>
  <b-alert
    show
    variant="dark"
    data-qa="error notice"
    class="mt-3"
  >
    <strong>{{ $t('error') }}:</strong> {{ error }}
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
