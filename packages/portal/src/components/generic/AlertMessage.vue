<template>
  <b-alert
    show
    variant="dark"
    data-qa="error notice"
    class="mt-3"
  >
    <strong>{{ $t('error') }}:</strong> {{ error?.message || error }}
  </b-alert>
</template>

<script>
  import { BAlert } from 'bootstrap-vue';

  export default {
    components: {
      BAlert
    },
    props: {
      error: {
        type: [String, Object, Error],
        default: ''
      }
    }
  };
</script>
