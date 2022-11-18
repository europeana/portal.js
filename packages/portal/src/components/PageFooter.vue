<template>
  <footer
    data-qa="footer"
    class="page-footer responsive-font"
  >
    <div class="footer-wrapper py-5">
      <b-container>
        <b-row>
          <b-col
            lg="5"
            class="left-col pb-4 order-lg-1"
          >
            <div class="pr-5 pr-lg-3">
              <div class="group-title text-uppercase font-weight-bold">
                {{ $t('footer.ourMission') }}
              </div>
              <p class="mission font-italic mb-0">
                {{ $t('footer.ourMissionQuote') }}
              </p>
            </div>
          </b-col>
          <b-col
            lg="5"
            class="left-col pb-4 order-lg-4"
          >
            <LinkGroup
              list-class="footer-link-list social-links"
              link-class="footer-link mt-1"
              :caption="$t('footer.findUsElsewhere')"
              :links="social"
            />
          </b-col>
          <b-col
            sm="6"
            lg="4"
            class="middle-col pb-4  order-sm-1 order-lg-2"
          >
            <LinkGroup
              v-if="footerMoreInfo"
              list-class="footer-link-list"
              link-class="footer-link"
              :caption="footerMoreInfo.name"
              :links="footerMoreInfo.links"
            />
          </b-col>
          <b-col
            sm="6"
            lg="4"
            class="middle-col pb-4 order-sm-3 order-lg-5 order-wqhd-3"
          >
            <LinkGroup
              v-if="footerHelp"
              list-class="footer-link-list"
              link-class="footer-link"
              :caption="footerHelp.name"
              :links="footerHelp.links"
            />
          </b-col>
          <b-col
            sm="6"
            lg="3"
            class="right-col pb-4  order-sm-2 order-lg-3"
          >
            <div class="group-title text-uppercase font-weight-bold pr-2">
              {{ $t('footer.customiseWebsiteLanguage') }}
            </div>
            <LangSelector
              class="mt-1"
              data-qa="language selector"
            />
          </b-col>
          <b-col
            sm="6"
            lg="3"
            class="right-col pb-4  order-sm-4 order-lg-6"
          >
            <LinkGroup
              v-if="showDebugLinkGroup"
              list-class="footer-link-list"
              link-class="footer-link"
              :caption="debugLinkGroup.name"
              :links="debugLinkGroup.links"
              data-qa="debug link group"
            />
          </b-col>
        </b-row>
        <hr class="my-5">
        <b-row>
          <b-col lg="6">
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
    <client-only
      v-if="feedbackEnabled"
    >
      <FeedbackWidget
        data-qa="feedback widget"
      />
    </client-only>
  </footer>
</template>

<script>
  import LangSelector from './generic/LanguageSelector';
  import LinkGroup from './generic/LinkGroup';
  import EULogo from '@/components/funders/EULogo';

  export default {
    components: {
      LangSelector,
      LinkGroup,
      EULogo,
      FeedbackWidget: () => import('../components/feedback/FeedbackWidget')
    },

    data() {
      return {
        social: [
          {
            text: 'Facebook',
            url: 'https://www.facebook.com/Europeana',
            icon: 'icon-facebook'
          },
          {
            text: 'Twitter',
            url: 'https://twitter.com/europeanaeu',
            icon: 'icon-twitter'
          },
          {
            text: 'Pinterest',
            url: 'https://www.pinterest.com/europeana',
            icon: 'icon-pinterest'
          },
          {
            text: 'Instagram',
            url: 'https://www.instagram.com/europeana_eu/',
            icon: 'icon-instagram'
          },
          {
            text: 'LinkedIn',
            url: 'https://www.linkedin.com/company/europeana',
            icon: 'icon-linkedin'
          }
        ]
      };
    },

    computed: {
      feedbackEnabled() {
        return this.$features.jiraServiceDeskFeedbackForm && this.$config.app.baseUrl;
      },
      debugSettings() {
        return this.$store.getters['debug/settings'];
      },
      showDebugLinkGroup() {
        return !!this.debugSettings.enabled;
      },
      footerMoreInfo() {
        return {
          name: this.$t('footer.navigation.MoreInfoLabel'),
          links: [
            { url: '/about-us', text: this.$t('footer.navigation.about') },
            { url: '/for-developers', text: this.$t('footer.navigation.forDevelopers') },
            { url: 'https://pro.europeana.eu/services/data-publication-services', text: this.$t('footer.navigation.provide') },
            { url: 'https://zcv4-zcmp.maillist-manage.eu/ua/Optin?od=12ba7e82b5aa&zx=14ad17d982&sD=119ffcbc10c08987', text: this.$t('footer.navigation.subscribe') }
          ]
        };
      },
      footerHelp() {
        return {
          name: this.$t('footer.navigation.help'),
          links: [
            { url: '/help', text: this.$t('footer.navigation.help') },
            { url: '/rights', text: this.$t('footer.navigation.terms') },
            { url: '/rights/privacy-policy', text: this.$t('footer.navigation.privacy') },
            { url: '/rights/accessibility-policy', text: this.$t('footer.navigation.accessibility') },
            { url: '/rights/cookies-policy', text: this.$t('footer.navigation.cookies') }
          ]
        };
      },
      debugLinkGroup() {
        return {
          name: this.$t('debug.debug'),
          links: [
            { url: '/debug', text: this.$t('debug.settings.title') },
            { url: '#api-requests', text: this.$t('debug.apiRequests.title'), dataQa: 'API requests link' },
            { url: '/debug/oembed', text: 'oEmbed' }
          ]
        };
      }
    }
  };
</script>

<style lang="scss">
  @import '@/assets/scss/variables';
  @import '@/assets/scss/icons';
  @import '@/assets/scss/footer';
</style>

<docs lang="md">
  ```jsx
  <PageFooter />
  ```
</docs>
