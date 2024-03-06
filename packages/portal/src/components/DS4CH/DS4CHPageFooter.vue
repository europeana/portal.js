<template>
  <footer
    data-qa="footer"
    class="page-footer xxl-page"
  >
    <b-container class="xxl-container">
      <b-row class="sub-footer">
        <EULogo
          class="eu-logo mb-3"
        />
        <p>{{ $t('ds4ch.footer.disclaimerLine1') }}</p>
      </b-row>
    </b-container>
    <FeedbackWidget
      :faq-url="null"
    />
  </footer>
</template>

<script>
  import EULogo from '../image/ImageEULogo';
  import FeedbackWidget from '../feedback/FeedbackWidget.vue';

  export default {
    name: 'DS4CHPageFooter',

    components: {
      EULogo,
      FeedbackWidget
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/DS4CH/style';
  @import '@europeana/style/scss/DS4CH/variables';

  .page-footer {
    background-color: $black;

    // styleguide fix
    &::after {
      content: none;
    }

    .container {
      padding: 6rem 2rem 6.5rem;

      @media (min-width: $bp-large) {
        margin-left: 2rem;
      }

      @media (min-width: $bp-extralarge) {
        padding-bottom: 10rem ;
        padding-left: 4rem;
        padding-right: 4rem;
        margin-left: 4rem;
      }

      @media (min-width: $bp-4k) {
        padding-bottom: 26rem ;
      }

      .row {
        margin-left: 0;
        margin-right: 0;
      }
    }
  }

  .sub-footer {
    max-width: 39rem;

    @media (min-width: $bp-4k) {
      max-width: 90rem;
    }

    .eu-logo {
      @media (min-width: $bp-4k) {
        width: 810px;
        margin-bottom: 2.625rem !important;
      }
    }

    p {
      color: $white;
      font-size: $font-size-smallest;

      @media (min-width: $bp-4k) {
        font-size: $font-size-large;
        margin-bottom: $font-size-large !important;
      }
    }
  }
</style>

<docs lang="md">
  ```jsx
  <DS4CHPageFooter />
  ```
</docs>
