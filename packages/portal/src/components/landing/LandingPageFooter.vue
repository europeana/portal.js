<template>
  <PageFooter
    class="landing-page-footer"
    :enable-lang-selector="false"
    :feedback-widget-faq-url="null"
    :help="null"
    :more-info="moreInfo"
  />
</template>

<script>
  import landingPageMixin from '@/mixins/landingPage';
  import PageFooter from '@/components/page/PageFooter';

  export default {
    name: 'LandingPageFooter',

    components: {
      PageFooter
    },

    mixins: [landingPageMixin],

    data() {
      return {
        apisPage: {
          moreInfo: {
            name: this.$t('landing.apis.footer.name'),
            links: [
              { url: 'https://europeana.atlassian.net/wiki/external/MGU4MjI4ZjA2MmM0NDg3M2JjODQ2ZTZjYzBhZWNhZTg', text: this.$t('landing.apis.footer.navigation.apiDocumentation') },
              { url: 'https://pro.europeana.eu/pages/get-api', text: this.$t('landing.apis.footer.navigation.requestApiKey') },
              { url: 'https://europeana.atlassian.net/wiki/spaces/EF/pages/2360508417/Europeana+API+FAQ', text: this.$t('footer.navigation.faq') },
              { url: 'mailto:api@europeana.eu', text: this.$t('landing.apis.footer.navigation.contactUs') },
              { url: 'https://www.europeana.eu/rights', text: this.$t('footer.navigation.terms') },
              { url: 'https://www.europeana.eu/rights/privacy-statement', text: this.$t('footer.navigation.privacy') }
            ]
          }
        },
        bhmPage: {
          moreInfo: {
            name: this.$t('footer.navigation.MoreInfoLabel'),
            links: [
              { url: '/rights', text: this.$t('footer.navigation.terms') },
              { url: '/rights/privacy-statement', text: this.$t('footer.navigation.privacy') },
              { url: '/rights/accessibility-policy', text: this.$t('footer.navigation.accessibility') },
              { url: '/rights/cookies-policy', text: this.$t('footer.navigation.cookies') }
            ]
          }
        },
        pageId: this.landingPageIdForRoute({ $config: this.$config, route: this.$route })
      };
    },

    computed: {
      moreInfo() {
        if (this.pageId === 'apis') {
          return this.apisPage.moreInfo;
        } else if (this.pageId === 'black-history-month') {
          return this.bhmPage.moreInfo;
        } else {
          return null;
        }
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/footer';

  .landing-page-footer {
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

    .group-title {
      @media (min-width: $bp-4k) {
        font-size: $font-size-xl;
        margin-bottom: 1rem;
      }
    }

    p.mission,
    .link-group-list li a {
      @media (min-width: $bp-4k) {
        font-size: $font-size-xl;
      }
    }

    .link-group-social .link-group-list li {
      @media (min-width: $bp-4k) {
        a {
          width: 4rem;
          height: 4rem;

          .footer-link-icon {
            font-size: 2rem;

            &.icon-facebook,
            &.icon-pinterest {
              font-size: 4rem;
            }
          }
        }

        &:not(:last-child) {
          margin-right: 1rem;
        }
      }
    }

    hr {
      @media (min-width: $bp-4k) {
        margin-top: 3rem;
        margin-bottom: 6rem;
      }
    }

    .col-lg-6 {
      @media (min-width: $bp-4k) {
        flex: 0 0 75%;
        max-width: 75%;
      }
    }

    .sub-footer {
      .eu-logo {
        @media (min-width: $bp-4k) {
          width: 810px;
          height: auto;
          margin-bottom: 2.625rem !important;
        }
      }

      p {
        @media (min-width: $bp-4k) {
          font-size: $font-size-large;
          margin-bottom: $font-size-large !important;
          max-width: 90rem;
        }
      }
    }

    .tech-partners {
      @media (min-width: $bp-large) {
        order: 3 !important;
      }
    }
  }
</style>

<docs lang="md">
  ```jsx
  <LandingPageFooter />
  ```
</docs>
