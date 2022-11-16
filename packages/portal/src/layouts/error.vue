<template>
  <div
    data-qa="error page"
    class="white-page"
  >
    <ErrorMessage
      data-qa="error message container"
      :error="error.message"
      :title-path="errorExplanation ? errorExplanation.titlePath : null"
      :illustration-src="errorExplanation ? errorExplanation.illustrationSrc : null"
    />
  </div>
</template>

<script>
  import ErrorMessage from '@/components/generic/ErrorMessage';

  export default {
    name: 'ErrorPage',

    components: {
      ErrorMessage
    },

    props: {
      error: {
        type: Object,
        required: true
      }
    },

    head() {
      return {
        title: this.$pageHeadTitle(this.$t(this.errorExplanation?.metaTitlePath || 'error'))
      };
    },

    computed: {
      errorExplanation() {
        if (this.error.statusCode === 404) {
          return {
            titlePath: 'errorMessage.pageNotFound.title',
            metaTitlePath: 'errorMessage.pageNotFound.metaTitle',
            illustrationSrc: require('@/assets/img/illustrations/il-page-not-found.svg')
          };
        }
        return null;
      }
    }
  };
</script>
