<template>
  <footer
    data-qa="footer"
    class="page-footer"
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
            class="left-col pb-4 order-lg-4"
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
            lg="4"
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
</style>

<docs lang="md">
  ```jsx
  <LandingPageFooter />
  ```
</docs>
