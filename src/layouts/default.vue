<template>
  <div>
    <client-only>
      <VueAnnouncer
        v-if="enableAnnouncer"
        data-qa="vue announcer"
      />
      <CookieDisclaimer
        v-if="!klaroEnabled"
      />
    </client-only>
    <div
      ref="resetfocus"
      data-qa="top page"
    />
    <a
      class="skip-main"
      href="#main"
      data-qa="main content accessibility link"
    >
      {{ $t('layout.skipToMain') }}
    </a>
    <PageHeader />
    <client-only
      v-if="feedbackEnabled"
    >
      <FeedbackWidget />
    </client-only>
    <main
      id="default"
      role="main"
    >
      <b-breadcrumb
        v-if="breadcrumbs"
        :items="breadcrumbs"
        class="mb-5"
      />
      <nuxt
        id="main"
      />
    </main>
    <client-only>
      <PageFooter />
    </client-only>
  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  import ClientOnly from 'vue-client-only';
  import PageHeader from '../components/PageHeader';
  import klaroConfig from '../plugins/klaro-config';
  import { version as bootstrapVersion } from 'bootstrap/package.json';
  import { version as bootstrapVueVersion } from 'bootstrap-vue/package.json';

  const config = {
    bootstrapVersion,
    bootstrapVueVersion,
    klaroVersion: '0.7.18'
  };

  export default {
    components: {
      ClientOnly,
      CookieDisclaimer: () => import('../components/generic/CookieDisclaimer'),
      PageHeader,
      PageFooter: () => import('../components/PageFooter'),
      FeedbackWidget: () => import('../components/feedback/FeedbackWidget')
    },

    data() {
      return {
        ...config,
        linkGroups: {},
        enableAnnouncer: true
      };
    },

    computed: {
      ...mapState({
        breadcrumbs: state => state.breadcrumb.data
      }),

      ...mapGetters({
        canonicalUrl: 'http/canonicalUrl',
        canonicalUrlWithoutLocale: 'http/canonicalUrlWithoutLocale'
      }),

      klaroEnabled() {
        return this.$config.app.features.klaro;
      },

      feedbackEnabled() {
        return this.$config.app.features.jiraServiceDeskFeedbackForm && this.$config.app.baseUrl;
      }
    },

    watch: {
      $route(to, from) {
        this.$nextTick(() => {
          if (to.path === from.path) {
            this.enableAnnouncer = false;
          } else {
            this.$refs.resetfocus.setAttribute('tabindex', '0');
            this.$refs.resetfocus.focus();
            this.enableAnnouncer = true;
          }
        });
      }
    },

    mounted() {
      this.timeoutUntilPiwikSet(0);

      if (this.$auth.$storage.getUniversal('portalLoggingIn') && this.$auth.loggedIn) {
        this.showToast(this.$t('account.notifications.loggedIn'));
        this.$auth.$storage.removeUniversal('portalLoggingIn');
      }
      if (this.$auth.$storage.getUniversal('portalLoggingOut') && !this.$auth.loggedIn) {
        this.showToast(this.$t('account.notifications.loggedOut'));
        this.$auth.$storage.removeUniversal('portalLoggingOut');
      }
    },

    methods: {
      showToast(msg) {
        this.$bvToast.toast(msg, {
          toastClass: 'brand-toast',
          toaster: 'b-toaster-bottom-left',
          autoHideDelay: 5000,
          isStatus: true,
          noCloseButton: true,
          solid: true
        });
      },

      renderKlaro() {
        if (typeof window.klaro !== 'undefined') {
          window.klaro.render(klaroConfig(this.$i18n, this.$initHotjar, this.$matomo), true);
          let manager = window.klaro.getManager(klaroConfig(this.$i18n, this.$initHotjar, this.$matomo));
          manager.watch({
            update(manager, eventType, data) {
              console.log('manager:', manager, 'eventType:', eventType, 'data:', data);
              if (eventType === 'saveConsents') {
                if (data.type === 'accept') {
                  //this.trackCookieConsent('Accept all', true);
                } else if (data.type === 'decline') {
                  //this.trackCookieConsent('Decline', null);
                } else if (data.type == 'save') {
                  //this.trackCookieConsent('Accept Selected', (({ matomo, hotjar}) => ({ matomo, hotjar}))(data.consents);
                }
              }
            }
          });
        }
        return null;
      },

      trackKlaro(button, options = {}) {
        this.$matomo.trackEvent('Klaro', button, options.toString());
      },

      timeoutUntilPiwikSet(counter) {
        if (this.$matomo || counter > 100) {
          if (this.klaroEnabled) {
            this.renderKlaro();
          } else {
            this.$matomo && this.$matomo.rememberCookieConsentGiven();
          }
        } else {
          setTimeout(() => {
            this.timeoutUntilPiwikSet(counter + 1);
          }, 10);
        }
      }
    },

    head() {
      const i18nSeo = this.$nuxtI18nSeo();

      return {
        htmlAttrs: {
          ...i18nSeo.htmlAttrs
        },
        link: [
          { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,700italic,400,600,700&subset=latin,greek,cyrillic&display=swap',
            body: true },
          { rel: 'stylesheet', href: `https://unpkg.com/bootstrap@${this.bootstrapVersion}/dist/css/bootstrap.min.css` },
          { rel: 'stylesheet', href: `https://cdn.kiprotect.com/klaro/v${this.klaroVersion}/klaro.min.css` },
          { rel: 'stylesheet', href: `https://unpkg.com/bootstrap-vue@${this.bootstrapVueVersion}/dist/bootstrap-vue.min.css` },
          { hreflang: 'x-default', rel: 'alternate', href: this.canonicalUrlWithoutLocale },
          ...i18nSeo.link
        ],
        script: [
          { src: `https://unpkg.com/klaro@${this.klaroVersion}/dist/klaro-no-css.js`, defer: true }
        ],
        meta: [
          { hid: 'description', property: 'description', content: 'Europeana' },
          { hid: 'og:url', property: 'og:url', content: this.canonicalUrl },
          ...i18nSeo.meta
        ]
      };
    }
  };
</script>
