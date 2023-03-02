<template>
  <span
    role="status"
    data-qa="loading spinner"
  >
    <span class="visually-hidden">
      {{ statusMessage || $t('loading') }}
    </span>
    <span
      class="spinner-border spinner-border-sm"
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
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.spinner-border {
  @at-root .xxl-page & {
    @media (min-width: $bp-4k) {
      width: 2rem;
      height: 2rem;
    }
  }
}
</style>
