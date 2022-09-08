<template>
  <div
    class="error-container gridless-container responsive-font"
    :class="{'pt-5': !errorExplanationAvailable}"
  >
    <div
      v-if="errorExplanationAvailable"
      class="error-explanation d-flex"
    >
      <b-img
        v-if="illustrationSrc"
        :src="illustrationSrc"
        alt=""
      />
      <section
        v-if="titlePath || descriptionPath"
        class="mt-4"
      >
        <i18n
          v-if="titlePath"
          tag="h1"
          :path="titlePath"
          class="mb-4"
        >
          <template #newline>
            <br>
          </template>
        </i18n>
        <p
          v-if="descriptionPath"
        >
          {{ $t(descriptionPath) }}
        </p>
      </section>
    </div>
    <AlertMessage
      :error="error"
    />
  </div>
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
      }
    },

    computed: {
      errorExplanationAvailable() {
        return this.illustrationSrc || this.titlePath || this.descriptionPath;
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

    @media (min-width: $bp-xxxl) {
      padding-bottom: 1vw;
    }
  }

  .error-explanation {
    min-height: 100vh;
    padding-top: 5rem;
    padding-bottom: 5rem;

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

    @media (min-width: $bp-xxxl) {
      padding-top: 5vw;
      padding-bottom: 5vw;
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

    @media (min-width: $bp-xxxl) {
      font-size: 1.375vw;
    }

    h1 {
      color: $mediumgrey;
      font-weight: 700;
      font-size: 2rem;

      @media (min-width: $bp-small) {
        font-size: 2.375rem;
      }

      @media (min-width: $bp-xxxl) {
        font-size: 2.375vw;
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
      illustration-src="src/assets/img/illustrations/il-item-not-found.svg"
  />
  ```
  </docs>
