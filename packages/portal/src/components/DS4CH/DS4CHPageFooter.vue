<template>
  <footer
    data-qa="footer"
    class="page-footer"
  >
    <div class="xxl-page">
      <b-container class="xxl-container">
        <h2 class="visually-hidden">
          {{ $t('footer.footer') }}
        </h2>
        <b-row>
          <b-col
            class="disclaimer mb-4 mb-lg-0"
            sm="12"
            lg="9"
          >
            <EULogo
              class="eu-logo mb-3"
            />
            <p>{{ $t('ds4ch.footer.disclaimerLine1') }}</p>
          </b-col>
          <b-col
            sm="12"
            lg="3"
          >
            <LinkGroup
              :title="footerMoreInfo.name"
              :links="footerMoreInfo.links"
            />
          </b-col>
        </b-row>
      </b-container>
    </div>
    <FeedbackWidget
      :faq-url="null"
    />
  </footer>
</template>

<script>
  import EULogo from '../image/ImageEULogo';
  import FeedbackWidget from '../feedback/FeedbackWidget';
  import LinkGroup from '../generic/LinkGroup';

  export default {
    name: 'DS4CHPageFooter',

    components: {
      EULogo,
      FeedbackWidget,
      LinkGroup
    },
    data() {
      return {
        footerMoreInfo: {
          name: this.$t('footer.navigation.MoreInfoLabel'),
          links: [
            { url: 'https://www.europeana.eu/rights', text: this.$t('footer.navigation.terms') },
            { url: 'https://www.europeana.eu/rights/privacy-', text: this.$t('footer.navigation.privacy') },
            { url: 'https://www.europeana.eu/rights/accessibility-policy', text: this.$t('footer.navigation.accessibility') },
            { url: 'https://www.europeana.eu/rights/cookies-policy', text: this.$t('footer.navigation.cookies') }
          ]
        }
      };
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/DS4CH/variables';

  .page-footer {
    background-color: $black;
    color: $white;

    // styleguide fix
    &::after {
      content: none;
    }

    .container {
      padding-top: 3.5rem;
      padding-bottom: 3.5rem;

      @media (max-width: ($bp-medium)) {
        padding-left: 2rem;
        padding-right: 2rem;
      }

      @media (min-width: $bp-large) {
        padding-top: 3.5rem;
        padding-bottom: 6rem ;
      }

      @media (min-width: $bp-4k) {
        padding-top: 16.5rem;
        padding-bottom: 16.5rem;
      }
    }
  }

  .disclaimer {
    .eu-logo {
      @media (min-width: $bp-4k) {
        width: 810px;
        height: auto;
        margin-bottom: 2.625rem !important;
      }
    }

    p {
      font-size: $font-size-smallest;
      max-width: 39rem;

      @media (min-width: $bp-4k) {
        font-size: $font-size-large;
        margin-bottom: $font-size-large !important;
        max-width: 90rem;
      }
    }
  }

  ::v-deep .link-group-light {
    .link-group-list li a {
      font-size: $font-size-base;

      @media (min-width: $bp-4k) {
        font-size: $font-size-xl;
      }
    }

    .group-title {
      @media (min-width: $bp-4k) {
        font-size: $font-size-xl;
        margin-bottom: 1rem;
      }
    }

  }
</style>

<docs lang="md">
  ```jsx
  <DS4CHPageFooter />
  ```
</docs>
