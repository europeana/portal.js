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
              <div class="d-flex mb-3">
                <SmartLink
                  :destination="ds4chLink"
                  class="mr-2 mr-sm-3"
                  :hide-external-icon="true"
                >
                  <img
                    :src="ds4chLogoSrc"
                    :alt="$t('ds4ch.homeLinkAlt')"
                    class="ds4ch-logo"
                    data-qa="ds4chLogo"
                    height="64"
                  >
                </SmartLink>
                <EULogo />
              </div>
              <p>{{ $t('footer.disclaimerLine1') }}</p>
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
  import EULogo from '@/components/image/ImageEULogo';
  import FeedbackWidget from '@/components/feedback/FeedbackWidget.vue';
  import LangSelector from '@/components/generic/LanguageSelector';
  import LinkGroup from '@/components/generic/LinkGroup';
  import SmartLink from '@/components/generic/SmartLink.vue';

  export default {
    components: {
      EULogo,
      FeedbackWidget,
      LangSelector,
      LinkGroup,
      SmartLink
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
              { url: '/rights/privacy-statement', text: this.$t('footer.navigation.privacy') },
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
              // TODO: Remove condition and stop filtering null values when ENABLE_MANAGE_API_KEYS is permanently enabaled.
              (this.$features.manageApiKeys ? { url: '/account/api-keys', text: this.$t('footer.navigation.registerApiKey'), dataQa: 'API key registration link' } : null),
              { url: 'https://zfrmz.eu/q6ulfDs1ONYQ0tEz0vpS', text: this.$t('footer.navigation.subscribe') }
            ].filter(Boolean)
          };
        }
      }
    },

    data() {
      return {
        ds4chLink: 'https://www.dataspace-culturalheritage.eu',
        ds4chLogoSrc: require('@europeana/style/img/DS4CH/logo.svg'),
        social: [
          {
            text: 'Facebook',
            url: 'https://www.facebook.com/Europeana',
            icon: 'icon-facebook',
            hideExternalIcon: true
          },
          {
            text: 'Bluesky',
            url: 'https://bsky.app/profile/europeana.bsky.social',
            icon: 'icon-bsky',
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
            { url: 'https://lokalise.com/', text: 'Lokalise', image: require('@europeana/style/img/supporting-technical-partners/Lokalise-logo.svg'), hideExternalIcon: true },
            { url: 'https://www.cloudflare.com/galileo/', text: 'Powered by Project Galileo', image: require('@europeana/style/img/supporting-technical-partners/Galileo-logo.webp'), hideExternalIcon: true }
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
