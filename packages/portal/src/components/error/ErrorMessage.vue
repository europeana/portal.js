<template>
  <b-container
    :class="{
      'error-container': errorExplanationAvailable,
      'pt-5': !errorExplanationAvailable
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
        v-if="title || description"
        class="mt-4"
      >
        <!-- eslint-disable vue/no-v-html -->
        <component
          :is="titleTag"
          v-if="title"
          class="title mb-4"
          v-html="title"
        />
        <!-- eslint-enable vue/no-v-html -->
        <p
          v-if="description"
        >
          {{ description }}
        </p>
      </section>
    </div>
    <AlertMessage
      v-show="showMessage && (error.message !== title)"
      :error="error.message"
    />
  </b-container>
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
      fullHeight: {
        type: Boolean,
        default: true
      },
      titleTag: {
        type: String,
        default: 'h1'
      }
    },

    computed: {
      illustrationSrc() {
        if (this.error.code) {
          const kebabCaseCode = kebabCase(this.error.code);
          try {
            return require(`@europeana/style/img/illustrations/il-${kebabCaseCode}.svg`);
          } catch (e) {
            // don't fall apart just because an image is not available...
          }
        }
        return null;
      },
      title() {
        return this.error.i18n?.title;
      },
      description() {
        return this.error.i18n?.description;
      },
      errorExplanationAvailable() {
        return this.title || this.description || this.illustrationSrc;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .container.error-container {
    padding-bottom: 1rem;
    margin-left: auto;
    margin-right: auto;

    @media (min-width: $bp-medium) {
      max-width: 92%;
    }

    @media (min-width: $bp-extralarge) {
      max-width: 75%;
    }

    @media (min-width: $bp-xxxl) {
      max-width: 65%;
    }

    @media (min-width: $bp-wqhd) {
      max-width: 50%;
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
  }

  section {
    width: 100%;
    color: $mediumgrey-light;
    max-width: 35rem;

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

    @media (min-width: $bp-4k) {
      font-size: calc(1.5 * 1.375rem);
      max-width: calc(1.5 * 35rem);
    }

    .title {
      color: $mediumgrey;
      font-weight: 700;
      font-size: 2rem;

      @media (min-width: $bp-small) {
        font-size: $font-size-xxl;
      }

      @media (min-width: $bp-4k) {
        font-size: $font-size-xxl-4k;
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
  <ErrorMessage
      :error="{
        message: 'No item with that identifier',
        code: 'itemNotFound',
        title: 'Item Not Found',
        description: 'The item may have been deleted'
      }"
      :full-height="false"
  />
  ```
  </docs>
