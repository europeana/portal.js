<template>
  <span
    v-show="!timeout"
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
      delay: {
        type: Number,
        default: 0
      },
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
    },

    data() {
      return {
        timeout: null
      };
    },

    mounted() {
      if (this.delay > 0) {
        this.timeout = setTimeout(() => {
          this.timeout = null;
        }, this.delay);
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
