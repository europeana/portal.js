<template>
  <footer
    data-qa="footer"
    class="page-footer landing-page-footer"
  >
    <div class="footer-wrapper xxl-page py-5">
      <b-container class="xxl-container">
        <h2
          class="visually-hidden"
          data-qa="footer heading"
        >
          {{ $t('footer.footer') }}
        </h2>
        <b-row>
          <b-col
            lg="5"
            class="left-col pb-4 order-lg-1"
            data-qa="footer mission statement"
          >
            <div class="pr-5 pr-lg-3">
              <h3 class="group-title text-uppercase font-weight-bold">
                {{ $t('footer.ourMission') }}
              </h3>
              <p class="mission font-italic mb-0">
                {{ $t('footer.ourMissionQuote') }}
              </p>
            </div>
          </b-col>
          <b-col
            lg="5"
            class="left-col pb-4 order-lg-3"
            data-qa="footer social links"
          >
            <LinkGroup
              class="social-links"
              :title="$t('footer.findUsElsewhere')"
              :links="social"
              variant="social"
            />
            <hr class="mt-4 mb-1 w-100 d-lg-none">
          </b-col>
          <b-col
            sm="6"
            lg="5"
            class="middle-col pb-4  order-sm-1 order-lg-2"
            data-qa="footer recourses"
          >
            <LinkGroup
              :title="resources.name"
              :links="resources.links"
            />
          </b-col>
        </b-row>
        <hr>
        <b-row>
          <b-col
            lg="6"
            data-qa="footer disclaimer"
          >
            <div class="sub-footer">
              <EULogo
                class="mb-3"
              />
              <p>{{ $t('footer.disclaimerLine1') }}</p>

              <p>{{ $t('footer.disclaimerLine2') }}</p>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <FeedbackWidget :faq-url="null" />
  </footer>
</template>

<script>
  import LinkGroup from '@/components/generic/LinkGroup';
  import EULogo from '@/components/image/ImageEULogo';
  import FeedbackWidget from '@/components/feedback/FeedbackWidget.vue';

  export default {
    name: 'LandingPageFooter',

    components: {
      EULogo,
      FeedbackWidget,
      LinkGroup
    },

    data() {
      return {
        social: [
          {
            text: 'Facebook',
            url: 'https://www.facebook.com/Europeana',
            icon: 'icon-facebook',
            hideExternalIcon: true
          },
          {
            text: 'X',
            url: 'https://twitter.com/europeanaeu',
            icon: 'icon-x',
            hideExternalIcon: true
          },
          {
            text: 'Pinterest',
            url: 'https://www.pinterest.com/europeana',
            icon: 'icon-pinterest',
            hideExternalIcon: true
          },
          {
            text: 'Instagram',
            url: 'https://www.instagram.com/europeana_eu/',
            icon: 'icon-instagram',
            hideExternalIcon: true
          },
          {
            text: 'LinkedIn',
            url: 'https://www.linkedin.com/company/europeana',
            icon: 'icon-linkedin',
            hideExternalIcon: true
          }
        ],
        resources: {
          name: this.$t('landing.footer.navigation.resourcesLabel'),
          links: [
            { url: 'https://europeana.atlassian.net/wiki/external/MGU4MjI4ZjA2MmM0NDg3M2JjODQ2ZTZjYzBhZWNhZTg', text: this.$t('landing.footer.navigation.apiDocumentation') },
            { url: 'https://pro.europeana.eu/pages/get-api', text: this.$t('landing.footer.navigation.requestApiKey') },
            { url: 'https://europeana.atlassian.net/wiki/spaces/EF/pages/2360508417/Europeana+API+FAQ', text: this.$t('footer.navigation.faq') },
            { url: 'mailto:api@europeana.eu', text: this.$t('landing.footer.navigation.contactUs') },
            { url: 'https://www.europeana.eu/rights', text: this.$t('footer.navigation.terms') },
            { url: 'https://www.europeana.eu/rights/privacy-policy', text: this.$t('footer.navigation.privacy') }
          ]
        }
      };
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

    .left-col,
    .middle-col {
      @media (min-width: $bp-wqhd) {
        order: unset !important;
        flex: 0 0 33.3333%;
        max-width: 33.3333%;
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
  }
</style>

<docs lang="md">
  ```jsx
  <LandingPageFooter />
  ```
</docs>
