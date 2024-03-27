<template>
  <div class="landing-layout">
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
      role="main"
    >
      <nuxt
        id="main"
      />
    </main>
    <PageFooter />
    <client-only>
      <PageCookieConsent
        v-if="cookieConsentRequired"
      />
    </client-only>
  </div>
</template>

<script>
  import PageHeader from '@/components/page/PageHeader';
  import PageFooter from '@/components/page/PageFooter';
  import klaroMixin from '@/mixins/klaro.js';
  import versions from '../../pkg-versions';

  export default {
    name: 'LandingLayout',

    components: {
      PageHeader,
      PageFooter,
      PageCookieConsent: () => import('@/components/page/PageCookieConsent')
    },

    mixins: [
      klaroMixin
    ],

    data() {
      return {
        klaroServices: ['auth-strategy', 'i18n', 'matomo']
      };
    },

    head() {
      return {
        link: [
          { rel: 'icon', href: require('@europeana/style/img/favicon.ico').default, type: 'image/x-icon' },
          { rel: 'stylesheet', href: `https://cdn.jsdelivr.net/npm/bootstrap@${versions.bootstrap}/dist/css/bootstrap.min.css` },
          { rel: 'stylesheet', href: `https://cdn.jsdelivr.net/npm/bootstrap-vue@${versions['bootstrap-vue']}/dist/bootstrap-vue.min.css` }
        ],
        meta: [
          { hid: 'og:url', property: 'og:url', content: this.$route.fullPath }
        ],
        script: [
          this.klaroHeadScript
        ]
      };
    }
  };
</script>
