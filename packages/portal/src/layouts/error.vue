<template>
  <div
    data-qa="error page"
  >
    <ErrorMessage
      data-qa="error message container"
      :error="error"
    />
  </div>
</template>

<script>
  import pageMetaMixin from '@/mixins/pageMeta';
  import ErrorMessage from '@/components/error/ErrorMessage';

  export default {
    name: 'ErrorPage',

    components: {
      ErrorMessage
    },

    mixins: [pageMetaMixin],

    props: {
      error: {
        type: Object,
        required: true
      }
    },

    fetch() {
      // so that pageMetaMixin can detect and use the error
      throw this.error;
    },

    computed: {
      pageMeta() {
        return {
          title: this.$t('error')
        };
      }
    }
  };
</script>
