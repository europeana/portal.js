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
    <PageHeader
      ref="pageHeader"
    />
    <main
      id="default"
      role="main"
    >
      <client-only
        v-if="!!notificationBanner"
      >
        <NotificationBanner
          :notification-text="$t(`notificationBanner.text.${notificationBanner}`)"
        />
      </client-only>
      <b-breadcrumb
        v-if="breadcrumbs"
        :items="breadcrumbs"
        class="mb-5"
      />
      <nuxt
        id="main"
      />
    </main>
    <client-only
      v-if="newFeatureNotificationEnabled"
    >
      <NewFeatureNotification
        :feature="featureNotification.name"
        :url="featureNotification.url"
        data-qa="new feature notification"
      >
        <p>{{ $t(`newFeatureNotification.text.${featureNotification.name}`) }}</p>
      </NewFeatureNotification>
    </client-only>
    <client-only>
      <PageFooter />
      <DebugApiRequests />
    </client-only>
    <b-toaster
      name="b-toaster-bottom-left-dynamic"
      class="b-toaster-bottom-left-dynamic"
      :style="{'--bottom': toastBottomOffset }"
    />
    <ErrorModal />
    <client-only>
      <PageCookieConsent
        v-if="cookieConsentRequired"
      />
    </client-only>
  </div>
</template>

<script>
  import { BBreadcrumb } from 'bootstrap-vue';
  import ClientOnly from 'vue-client-only';
  import PageHeader from '../components/page/PageHeader';
  import ErrorModal from '../components/error/ErrorModal';
  import canonicalUrlMixin from '@/mixins/canonicalUrl';
  import makeToastMixin from '@/mixins/makeToast';
  import klaroMixin from '@/mixins/klaro.js';
  import versions from '../../pkg-versions';
  import featureNotifications from '@/features/notifications';

  export default {
    name: 'DefaultLayout',

    components: {
      DebugApiRequests: () => import('../components/debug/DebugApiRequests'),
      BBreadcrumb,
      ClientOnly,
      PageCookieConsent: () => import('../components/page/PageCookieConsent'),
      PageHeader,
      PageFooter: () => import('../components/page/PageFooter'),
      NewFeatureNotification: () => import('../components/generic/NewFeatureNotification'),
      NotificationBanner: () => import('@/components/generic/NotificationBanner'),
      ErrorModal
    },

    mixins: [
      canonicalUrlMixin,
      klaroMixin,
      makeToastMixin
    ],

    data() {
      return {
        dateNow: Date.now(),
        linkGroups: {},
        enableAnnouncer: true,
        featureNotification: featureNotifications.find(feature => feature.name === this.$config?.app?.featureNotification),
        featureNotificationExpiration: this.$config.app.featureNotificationExpiration,
        notificationBanner: this.$config?.app?.notificationBanner
      };
    },

    head() {
      const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true });

      return {
        title: this.$config.app.siteName,
        htmlAttrs: {
          ...i18nHead.htmlAttrs
        },
        link: [
          { rel: 'icon', href: require('@europeana/style/img/favicon.ico').default, type: 'image/x-icon' },
          { rel: 'stylesheet', href: `https://cdn.jsdelivr.net/npm/bootstrap@${versions.bootstrap}/dist/css/bootstrap.min.css` },
          { rel: 'stylesheet', href: `https://cdn.jsdelivr.net/npm/bootstrap-vue@${versions['bootstrap-vue']}/dist/bootstrap-vue.min.css` },
          { hreflang: 'x-default', rel: 'alternate', href: this.canonicalUrl({ fullPath: true, locale: false }) },
          ...i18nHead.link
        ],
        script: [
          this.klaroHeadScript
        ],
        meta: [
          ...i18nHead.meta,
          { hid: 'description', name: 'description', content: this.$config.app.siteName },
          { hid: 'og:description', property: 'og:description', content: this.$config.app.siteName },
          { hid: 'og:url', property: 'og:url', content: this.canonicalUrl({ fullPath: true, locale: true }) }
        ]
      };
    },

    computed: {
      breadcrumbs() {
        return this.$store.state.breadcrumb.data;
      },

      newFeatureNotificationEnabled() {
        return !!this.featureNotification &&
          (!this.featureNotificationExpiration || (this.dateNow < this.featureNotificationExpiration)) &&
          (!this.$cookies.get('new_feature_notification') || this.$cookies.get('new_feature_notification') !== this.featureNotification.name);
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
      if (this.$auth.$storage.getUniversal('portalLoggingIn') && this.$auth.loggedIn) {
        this.makeToast(this.$t('account.notifications.loggedIn'));
        this.$auth.$storage.removeUniversal('portalLoggingIn');
      }
      if (this.$auth.$storage.getUniversal('portalLoggingOut') && !this.$auth.loggedIn) {
        this.makeToast(this.$t('account.notifications.loggedOut'));
        this.$auth.$storage.removeUniversal('portalLoggingOut');
      }
    }
  };
</script>

<style lang="scss" scoped>
  ::v-deep .notification-banner.d-flex ~ .home {
    margin-top: -9.2rem;
  }
</style>
