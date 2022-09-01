<template>
  <div class="error-container gridless-container responsive-font">
    <div class="d-flex flex-wrap flex-sm-nowrap align-items-center justify-content-between">
      <b-img
        :src="illustrationSrc"
        alt=""
      />
      <section class="mt-4 text-center text-sm-left">
        <i18n
          tag="h1"
          :path="titlePath"
        >
          <template #newline>
            <br>
          </template>
        </i18n>
        <p
          data-qa="error message"
        >
          {{ $t(descriptionPath || '') }}
        </p>
      </section>
    </div>
    <AlertMessage
      class="mt-5"
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
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .error-container {
    padding-top: 5rem;
    padding-bottom: 5rem;
    margin-left: auto;
    margin-right: auto;

    @media (min-width: $bp-medium) {
      max-width: 90%;
    }

    @media (min-width: $bp-extralarge) {
      padding-top: 10rem;
      padding-bottom: 12rem;
      max-width: 75%;
    }

    @media (min-width: $bp-xxxl) {
      padding-top: 10vw;
      padding-bottom: 12vw;
    }
  }

  section {
    width: 100%;
    color: $mediumgrey-light;

    @media (min-width: $bp-small) {
      height: auto;
      width: 50%;
    }

    @media (min-width: $bp-xxxl) {
      max-width: 35em;
    }

    h1 {
      color: $mediumgrey;
      font-weight: 700;
    }
  }

  img {
    margin: 0 auto;
    display: block;
    width: 50%;

    @media (min-width: $bp-small) {
      margin: 0;
      width: 35%;
    }
  }

  ::v-deep .alert {
    overflow: hidden;
    line-break: anywhere;
  }
</style>

<docs lang="md">
  ```jsx
  <ErrorMessage
      error="Item was not found"
      title-path="errorMessage.item.title"
      description-path="errorMessage.item.description"
      illustration-src="src/assets/img/illustrations/il-item-not-found.svg"
  />
  ```
  </docs>
