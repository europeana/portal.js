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
        v-if="illustrationSrcValue"
        :src="illustrationSrcValue"
        alt=""
      />
      <section
        v-if="titlePathValue || descriptionPathValue"
        class="mt-4"
      >
        <i18n
          v-if="titlePathValue"
          tag="h1"
          :path="titlePathValue"
          class="mb-4"
        >
          <template #newline>
            <br>
          </template>
        </i18n>
        <p
          v-if="descriptionPathValue"
        >
          {{ $t(descriptionPathValue) }}
        </p>
      </section>
    </div>
    <AlertMessage
      v-show="error"
      :error="error"
    />
  </b-container>
</template>

<script>
  import AlertMessage from '@/components/generic/AlertMessage';

  export default {
    name: 'ErrorMessage',

    components: {
      AlertMessage
    },

    props: {
      titlePath: {
        type: String,
        default: null
      },
      descriptionPath: {
        type: String,
        default: null
      },
      illustrationSrc: {
        type: String,
        default: null
      },
      error: {
        type: String,
        default: null
      },
      gridless: {
        type: Boolean,
        default: true
      },
      fullHeight: {
        type: Boolean,
        default: true
      },
      statusCode: {
        type: Number,
        default: null
      }
    },

    data() {
      return {
        httpErrors: {
          404: {
            titlePath: 'errorMessage.pageNotFound.title',
            illustrationSrc: require('@/assets/img/illustrations/il-page-not-found.svg')
          }
        }
      };
    },

    computed: {
      titlePathValue() {
        return this.titlePath || this.httpError?.titlePath;
      },
      descriptionPathValue() {
        return this.descriptionPath || this.httpError?.descriptionPath;
      },
      illustrationSrcValue() {
        return this.illustrationSrc || this.httpError?.illustrationSrc;
      },
      httpError() {
        return this.httpErrors[this.statusCode] || null;
      },
      errorExplanationAvailable() {
        return this.illustrationSrcValue || this.titlePathValue || this.descriptionPathValue;
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
  <ErrorMessage
      error="Item was not found"
      title-path="errorMessage.itemNotFound.title"
      description-path="errorMessage.itemNotFound.description"
      illustration-src="/img/illustrations/il-item-not-found.svg"
  />
  ```
  </docs>
