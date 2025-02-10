<template>
  <div class="landing-layout">
    <a
      class="skip-main"
      href="#main"
      data-qa="main content accessibility link"
    >
      {{ $t('layout.skipToMain') }}
    </a>
    <LandingPageHeader
      ref="pageHeader"
    />
    <main
      role="main"
    >
      <nuxt
        id="main"
      />
    </main>
    <LandingPageFooter />
    <client-only>
      <PageCookiesWidget
        v-if="$features.embeddedMediaNotification"
        :klaro-services="['auth-strategy', 'i18n', 'matomo', 'codepen']"
      />
      <PageCookieConsent
        v-else
        :klaro-services="['auth-strategy', 'i18n', 'matomo']"
      />
    </client-only>
  </div>
</template>

<script>
  import { computed } from 'vue';
  import LandingPageHeader from '@/components/landing/LandingPageHeader';
  import LandingPageFooter from '@/components/landing/LandingPageFooter';
  import { createCanonicalUrlFromVue } from '@/utils/url/canonicalUrl.js';
  import versions from '../../pkg-versions';

  export default {
    name: 'LandingLayout',

    components: {
      LandingPageHeader,
      LandingPageFooter,
      PageCookieConsent: () => import('@/components/page/PageCookieConsent'),
      PageCookiesWidget: () => import('@/components/page/PageCookiesWidget')
    },

    provide() {
      return {
        canonicalUrl: computed(() => this.canonicalUrl)
      };
    },

    data() {
      return {
        canonicalUrl: {}
      };
    },

    head() {
      return {
        link: [
          { rel: 'icon', href: require('@europeana/style/img/favicon.ico').default, type: 'image/x-icon' },
          { rel: 'preload', as: 'style', href: `https://cdn.jsdelivr.net/npm/bootstrap@${versions.bootstrap}/dist/css/bootstrap.min.css` },
          { rel: 'stylesheet', href: `https://cdn.jsdelivr.net/npm/bootstrap@${versions.bootstrap}/dist/css/bootstrap.min.css` },
          { rel: 'preload', as: 'style', href: `https://cdn.jsdelivr.net/npm/bootstrap-vue@${versions['bootstrap-vue']}/dist/bootstrap-vue.min.css` },
          { rel: 'stylesheet', href: `https://cdn.jsdelivr.net/npm/bootstrap-vue@${versions['bootstrap-vue']}/dist/bootstrap-vue.min.css` }
        ],
        meta: [
          { hid: 'og:url', property: 'og:url', content: this.canonicalUrl.withOnlyQuery }
        ]
      };
    },

    created() {
      this.canonicalUrl = createCanonicalUrlFromVue(this);
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  main {
    margin-top: 70px;

    @media (min-width: $bp-4k) {
      margin-top: calc(1.5 * 70px);
    }
  }
</style>
