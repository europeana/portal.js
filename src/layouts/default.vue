<template>
  <div>
    <client-only>
      <VueAnnouncer
        v-if="enableAnnouncer"
        data-qa="vue announcer"
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
  import { BBreadcrumb } from 'bootstrap-vue';
  import ClientOnly from 'vue-client-only';
  import PageHeader from '../components/PageHeader';
  import klaroConfig, { version as klaroVersion } from '../plugins/klaro-config';
  import { version as bootstrapVersion } from 'bootstrap/package.json';
  import { version as bootstrapVueVersion } from 'bootstrap-vue/package.json';

  export default {
    name: 'DefaultLayout',

    components: {
      BBreadcrumb,
      ClientOnly,
      PageHeader,
      PageFooter: () => import('../components/PageFooter'),
      FeedbackWidget: () => import('../components/feedback/FeedbackWidget')
    },

    data() {
      return {
        linkGroups: {},
        enableAnnouncer: true,
        klaro: null
      };
    },

    head() {
      const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true });

      return {
        htmlAttrs: {
          ...i18nHead.htmlAttrs
        },
        link: [
          { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,700italic,400,600,700&subset=latin,greek,cyrillic&display=swap',
            body: true },
          { rel: 'stylesheet', href: `https://unpkg.com/bootstrap@${bootstrapVersion}/dist/css/bootstrap.min.css` },
          { rel: 'stylesheet', href: `https://unpkg.com/klaro@${klaroVersion}/dist/klaro.min.css` },
          { rel: 'stylesheet', href: `https://unpkg.com/bootstrap-vue@${bootstrapVueVersion}/dist/bootstrap-vue.min.css` },
          { hreflang: 'x-default', rel: 'alternate', href: this.canonicalUrlWithoutLocale },
          ...i18nHead.link
        ],
        script: [
          { src: `https://unpkg.com/klaro@${klaroVersion}/dist/klaro-no-css.js`, defer: true }
        ],
        meta: [
          { hid: 'description', property: 'description', content: 'Europeana' },
          { hid: 'og:url', property: 'og:url', content: this.canonicalUrl },
          ...i18nHead.meta
        ]
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

      feedbackEnabled() {
        return this.$features.jiraServiceDeskFeedbackForm && this.$config.app.baseUrl;
      }
    },

    watch: {
      '$i18n.locale': 'renderKlaro',

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
      this.klaro = window.klaro;

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
        if (this.klaro) {
          const config = klaroConfig(this.$i18n, this.$initHotjar, this.$matomo);
          const manager = this.klaro.getManager(config);

          this.klaro.render(config, true);
          manager.watch({ update: this.watchKlaroManagerUpdate });
        }
      },

      watchKlaroManagerUpdate(manager, eventType, data) {
        let eventName;

        if (eventType === 'saveConsents') {
          eventName = {
            accept: 'Okay/Accept all',
            decline: 'Decline',
            save: 'Accept selected'
          }[data.type];
        }

        eventName && this.trackKlaroClickEvent(eventName);
      },

      trackKlaroClickEvent(eventName) {
        this.$matomo && this.$matomo.trackEvent('Klaro', 'Clicked', eventName);
      },

      timeoutUntilPiwikSet(counter) {
        if (this.$matomo || counter > 100) {
          this.renderKlaro();
        } else {
          setTimeout(() => {
            this.timeoutUntilPiwikSet(counter + 1);
          }, 10);
        }
      }
    }
  };
</script>
