<template>
  <footer
    data-qa="footer"
    class="page-footer"
  >
    <div class="footer-wrapper py-5">
      <b-container>
        <h2 class="visually-hidden">
          {{ $t('footer.footer') }}
        </h2>
        <b-row>
          <b-col
            lg="5"
            class="left-col pb-4 order-lg-1"
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
          >
            <LinkGroup
              list-class="footer-link-list social-links"
              link-class="footer-link mt-1"
              :title="$t('footer.findUsElsewhere')"
              :links="social"
            />
            <hr class="mt-4 mb-1 w-100 d-lg-none">
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
              :title="footerMoreInfo.name"
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
              :title="footerHelp.name"
              :links="footerHelp.links"
            />
          </b-col>
          <b-col
            sm="6"
            lg="3"
            class="right-col pb-4  order-sm-2 order-lg-3"
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
            v-if="showDebugLinkGroup"
            sm="6"
            lg="3"
            class="right-col pb-4  order-sm-4 order-lg-6"
          >
            <LinkGroup
              list-class="footer-link-list"
              link-class="footer-link"
              :title="debugLinkGroup.name"
              :links="debugLinkGroup.links"
              data-qa="debug link group"
            />
          </b-col>
        </b-row>
        <hr>
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
      <div
        id="europeana-feedback-widget"
        data-api-url="/_api/jira-service-desk/feedback"
        :data-locale="$i18n.locale"
      />
      <script
        type="module"
        src="https://cdn.jsdelivr.net/npm/@europeana/feedback-widget/dist/europeana-feedback-widget.js"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@europeana/feedback-widget/dist/europeana-feedback-widget.css"
      >
    </client-only>
  </footer>
</template>

<script>
  import LangSelector from '../generic/LanguageSelector';
  import LinkGroup from '../generic/LinkGroup';
  import EULogo from '../image/ImageEULogo';

  export default {
    components: {
      LangSelector,
      LinkGroup,
      EULogo
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
            { url: '/rights/cookies-policy', text: this.$t('footer.navigation.cookies') },
            { url: '/faq', text: this.$t('footer.navigation.faq') }
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
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/icons';
  @import '@europeana/style/scss/footer';

  .dropdown {
    .btn-light,
    .dropdown-menu {
      @media (min-width: $bp-wqhd) {
        font-size: 1.125rem;
      }
    }
  }
</style>

<docs lang="md">
  ```jsx
  <PageFooter />
  ```
</docs>
