<template>
  <component
    :is="tag"
    v-if="visible"
  >
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
  </component>
</template>

<script>
  export default {
    name: 'LoadingSpinner',

    props: {
      tag: {
        type: String,
        default: 'div'
      },
      /**
       * Delay to wait before showing the spinner, in ms
       */
      delay: {
        type: Number,
        default: 500
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
        timeout: null,
        visible: this.delay === 0
      };
    },

    beforeDestroy() {
      this.timeout = null;
    },

    mounted() {
      if (this.delay > 0) {
        this.timeout = setTimeout(() => {
          this.timeout = null;
          this.visible = true;
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
