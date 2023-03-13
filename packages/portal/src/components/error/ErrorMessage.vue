<template>
  <div
    :class="{
      'error-container': errorExplanationAvailable,
      'pt-5': !errorExplanationAvailable,
      'gridless-container responsive-font': gridless
    }"
  >
    <div
      v-if="errorExplanationAvailable"
      class="error-explanation d-flex"
      :class="{ 'full-height': fullHeight }"
      data-qa="error explanation"
    >
      <b-img
        v-if="illustrationSrc"
        :src="illustrationSrc"
        alt=""
      />
      <section
        v-if="error.title || error.description"
        class="mt-4"
      >
        <!-- eslint-disable vue/no-v-html -->
        <h1
          v-if="error.title"
          class="mb-4"
          v-html="$options.filters.convertNewLine(error.title)"
        />
        <!-- eslint-enable vue/no-v-html -->
        <p
          v-if="error.description"
        >
          {{ error.description }}
        </p>
      </section>
    </div>
    <AlertMessage
      v-show="showMessage && (error.message !== error.title)"
      :error="error.message"
    />
  </div>
</template>

<script>
  import kebabCase from 'lodash/kebabCase';

  import AlertMessage from '../generic/AlertMessage';

  export default {
    name: 'ErrorMessage',

    components: {
      AlertMessage
    },

    props: {
      error: {
        type: Object,
        required: true
      },
      showMessage: {
        type: Boolean,
        default: true
      },
      gridless: {
        type: Boolean,
        default: true
      },
      fullHeight: {
        type: Boolean,
        default: true
      }
    },

    computed: {
      descriptionPath() {
        return this.error.code ? `errorMessage.${this.error.code}.description` : null;
      },
      illustrationSrc() {
        if (this.error.code) {
          const kebabCaseCode = kebabCase(this.error.code);
          try {
            return require(`@/assets/img/illustrations/il-${kebabCaseCode}.svg`);
          } catch (e) {
            // don't fall apart just because an image is missing...
          }
        }
        return null;
      },
      errorExplanationAvailable() {
        return this.error.title || this.error.description || this.illustrationSrc;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .error-container {
    padding-bottom: 1rem;
    margin-left: auto;
    margin-right: auto;

    @media (min-width: $bp-medium) {
      max-width: 92%;
    }

    @media (min-width: $bp-extralarge) {
      max-width: 75%;
    }

    &.gridless-container {
      @media (min-width: $bp-xxxl) {
        padding-bottom: 1vw;
      }
    }
  }

  .error-explanation {
    padding-top: 3.125rem;
    padding-bottom: 3.125rem;

    @media (min-width: $bp-large) {
      padding-top: 5rem;
      padding-bottom: 5rem;
    }

    &.full-height {
      min-height: 100vh;
    }

    @media (orientation: portrait) {
      flex-wrap: wrap;
      align-content: center;
      justify-content: center;
    }

    @media (orientation: landscape) {
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;
    }

    &.gridless-container {
      @media (min-width: $bp-xxxl) {
        padding-top: 5vw;
        padding-bottom: 5vw;
      }
    }
  }

  section {
    width: 100%;
    color: $mediumgrey-light;
    max-width: 35em;

    @media (orientation: portrait) {
      text-align: center;
    }

    @media (orientation: landscape) {
      height: auto;
      width: 42%;
    }

    @media (min-width: $bp-small) {
      font-size: 1.375rem;
    }

    @at-root .xxl-page & {
      @media (min-width: $bp-4k) {
        font-size: calc(1.5 * 1.375rem);
      }
    }

    &.gridless-container {
      @media (min-width: $bp-xxxl) {
        font-size: 1.375vw;
      }
    }

    h1 {
      color: $mediumgrey;
      font-weight: 700;
      font-size: 2rem;

      @media (min-width: $bp-small) {
        font-size: 2.375rem;
      }

      @at-root .xxl-page & {
        @media (min-width: $bp-4k) {
          font-size: calc(1.5 * 2.375rem);
        }
      }

      &.gridless-container {
        @media (min-width: $bp-xxxl) {
          font-size: 2.375vw;
        }
      }
    }
  }

  img {
    margin: 0 auto;
    display: block;
    width: 75%;

    @media (min-width: $bp-small) {
      width: 52%;
    }

    @media (orientation: landscape) {
      margin: 0;
    }
  }

  ::v-deep .alert {
    overflow: hidden;
  }
</style>

<docs lang="md">
  ```jsx
  <!-- FIXME -->
  <ErrorMessage
      error="Item was not found"
      title-path="errorMessage.itemNotFound.title"
      description-path="errorMessage.itemNotFound.description"
      illustration-src="/img/illustrations/il-item-not-found.svg"
  />
  ```
  </docs>
