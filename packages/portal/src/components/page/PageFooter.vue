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
            v-if="moreInfo"
            sm="6"
            lg="4"
            class="middle-col pb-4  order-sm-1 order-lg-2"
            data-qa="footer resources"
          >
            <LinkGroup
              :title="moreInfo.name"
              :links="moreInfo.links"
            />
          </b-col>
          <b-col
            v-if="help"
            sm="6"
            lg="4"
            class="middle-col pb-4 order-sm-3 order-lg-5 order-wqhd-3"
          >
            <LinkGroup
              :title="help.name"
              :links="help.links"
            />
          </b-col>
          <b-col
            v-if="enableLangSelector"
            sm="6"
            lg="3"
            class="right-col pb-4 order-sm-2 order-lg-3"
          >
            <h3 class="group-title text-uppercase font-weight-bold pr-2">
              {{ $t('footer.customiseWebsiteLanguage') }}
            </h3>
            <LangSelector
              class="mt-1"
              data-qa="language selector"
            />
          </b-col>
          <b-col
            v-if="supportingTechnicalPartners"
            sm="6"
            lg="3"
            class="pb-4 order-sm-4 order-lg-6"
          >
            <LinkGroup
              :title="supportingTechnicalPartners.name"
              :links="supportingTechnicalPartners.links"
              variant="supporting-tech-partners"
              data-qa="supporting technical partners"
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
    <FeedbackWidget
      :faq-url="feedbackWidgetFaqUrl"
    />
  </footer>
</template>

<script>
  import LangSelector from '../generic/LanguageSelector';
  import LinkGroup from '../generic/LinkGroup';
  import EULogo from '../image/ImageEULogo';
  import FeedbackWidget from '../feedback/FeedbackWidget.vue';

  export default {
    components: {
      EULogo,
      FeedbackWidget,
      LangSelector,
      LinkGroup
    },

    props: {
      enableLangSelector: {
        type: Boolean,
        default: true
      },
      feedbackWidgetFaqUrl: {
        type: String,
        default: '/faq'
      },
      help: {
        type: Object,
        default() {
          return {
            name: this.$t('footer.navigation.help'),
            links: [
              { url: '/help', text: this.$t('footer.navigation.help') },
              { url: '/rights', text: this.$t('footer.navigation.terms') },
              { url: '/rights/privacy-policy', text: this.$t('footer.navigation.privacy') },
              { url: '/rights/accessibility-policy', text: this.$t('footer.navigation.accessibility') },
              { url: '/rights/cookies-policy', text: this.$t('footer.navigation.cookies') },
              { url: '/faq', text: this.$t('footer.navigation.faq') }
            ]
          };
        }
      },
      moreInfo: {
        type: Object,
        default() {
          return {
            name: this.$t('footer.navigation.MoreInfoLabel'),
            links: [
              { url: '/about-us', text: this.$t('footer.navigation.about') },
              { url: '#api-requests', text: this.$t('footer.navigation.seeApiRequests'), dataQa: 'API requests link' },
              { url: 'https://pro.europeana.eu/services/data-publication-services', text: this.$t('footer.navigation.provide') },
              { url: 'https://zcv4-zcmp.maillist-manage.eu/ua/Optin?od=12ba7e82b5aa&zx=14ad17d982&sD=119ffcbc10c08987', text: this.$t('footer.navigation.subscribe') }
            ]
          };
        }
      }
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
        supportingTechnicalPartners: {
          name: this.$t('footer.navigation.supportingTechnicalPartners'),
          links: [
            { url: 'https://www.contentful.com', text: 'Powered by Contentful', image: require('@europeana/style/img/supporting-technical-partners/Contentful-logo.svg'), hideExternalIcon: true },
            { url: 'https://lokalise.com/', text: 'Lokalise', image: require('@europeana/style/img/supporting-technical-partners/Lokalise-logo.svg'), hideExternalIcon: true }
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
  <PageFooter />
  ```
</docs>
