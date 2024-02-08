<template>
  <footer
    data-qa="footer"
    class="page-footer xxl-page"
  >
    <b-container class="xxl-container">
      <div class="sub-footer">
        <EULogo
          class="eu-logo mb-3"
        />
        <p>{{ $t('footer.disclaimerLine1') }}</p>

        <p>{{ $t('footer.disclaimerLine2') }}</p>
      </div>
    </b-container>
  </footer>
</template>

<script>
  import EULogo from '../image/ImageEULogo';

  export default {
    name: 'DS4CHPageFooter',

    components: {
      EULogo
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
      padding-top: 6rem;
      padding-bottom: 6.5rem;

      @media (min-width: $bp-large) {
        padding-bottom: 10rem ;
      }

      @media (min-width: $bp-4k) {
        padding-bottom: 26rem ;
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
