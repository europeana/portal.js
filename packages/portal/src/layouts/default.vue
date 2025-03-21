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
          :text="$t(`notificationBanner.text.${notificationBanner}`)"
        />
      </client-only>
      <ProvideCanonicalUrl>
        <nuxt
          id="main"
        />
      </ProvideCanonicalUrl>
    </main>
    <client-only>
      <NewFeatureNotification
        v-if="featureNotification"
        :name="featureNotification.name"
        :url="featureNotification.url"
        data-qa="new feature notification"
      />
      <NewFeatureTooltip
        v-if="featureNotification"
        :name="featureNotification.name"
        :tooltip-target-id="featureNotification.tooltipTargetId"
      />
      <PageFooter />
      <DebugApiRequests />
    </client-only>
    <b-toaster
      name="b-toaster-bottom-left"
      class="b-toaster-bottom-left"
    />
    <ErrorModal />
    <client-only>
      <PageCookiesWidget />
    </client-only>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';
  import PageHeader from '@/components/page/PageHeader';
  import ProvideCanonicalUrl from '@/components/provide/ProvideCanonicalUrl';
  import ErrorModal from '@/components/error/ErrorModal';
  import useMakeToast from '@/composables/makeToast.js';
  import versions from '../../pkg-versions';
  import { activeFeatureNotification } from '@/features/notifications';

  export default {
    name: 'DefaultLayout',

    components: {
      DebugApiRequests: () => import('@/components/debug/DebugApiRequests'),
      ClientOnly,
      PageCookiesWidget: () => import('@/components/page/PageCookiesWidget'),
      PageHeader,
      PageFooter: () => import('@/components/page/PageFooter'),
      ProvideCanonicalUrl,
      NewFeatureNotification: () => import('@/components/generic/NewFeatureNotification'),
      NewFeatureTooltip: () => import('@/components/generic/NewFeatureTooltip'),
      NotificationBanner: () => import('@/components/generic/NotificationBanner'),
      ErrorModal
    },

    setup() {
      const { makeToast } = useMakeToast();
      return { makeToast };
    },

    data() {
      return {
        enableAnnouncer: true,
        featureNotification: activeFeatureNotification(this.$nuxt?.context),
        linkGroups: {},
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
          { rel: 'preload', as: 'style', href: `https://cdn.jsdelivr.net/npm/bootstrap@${versions.bootstrap}/dist/css/bootstrap.min.css` },
          { rel: 'stylesheet', href: `https://cdn.jsdelivr.net/npm/bootstrap@${versions.bootstrap}/dist/css/bootstrap.min.css` },
          { rel: 'preload', as: 'style', href: `https://cdn.jsdelivr.net/npm/bootstrap-vue@${versions['bootstrap-vue']}/dist/bootstrap-vue.min.css` },
          { rel: 'stylesheet', href: `https://cdn.jsdelivr.net/npm/bootstrap-vue@${versions['bootstrap-vue']}/dist/bootstrap-vue.min.css` },
          ...i18nHead.link
        ],
        meta: [
          ...i18nHead.meta,
          { hid: 'description', name: 'description', content: this.$config.app.siteName },
          { hid: 'og:description', property: 'og:description', content: this.$config.app.siteName }
        ]
      };
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
  ::v-deep .notification-banner ~ #main .home {
    margin-top: -8rem;
  }
</style>
