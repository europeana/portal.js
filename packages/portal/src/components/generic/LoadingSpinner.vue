<template>
  <span
    role="status"
    data-qa="loading spinner"
  >
    <span class="visually-hidden">
      {{ statusMessage || $t('loading') }}
    </span>
    <span
      class="spinner-border"
      :class="`spinner-border-${size}`"
      aria-hidden="true"
    />
  </span>
</template>

<script>
  export default {
    name: 'LoadingSpinner',

    props: {
      statusMessage: {
        type: String,
        default: null
      },
      /**
       * Size of the spinner
       * @values: sm, lg
       */
      size: {
        type: String,
        default: 'sm'
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';

.spinner-border-lg {
  width: 4rem;
  height: 4rem;
}

.spinner-border {
  @at-root .xxl-page & {
    @media (min-width: $bp-4k) {
      width: 2rem;
      height: 2rem;
    }
  }
}
</style>
