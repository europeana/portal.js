<template>
  <div class="ds4ch-layout">
    <a
      class="skip-main"
      href="#main"
      data-qa="main content accessibility link"
    >
      {{ $t('layout.skipToMain') }}
    </a>
    <DS4CHPageHeader
      ref="pageHeader"
    />
    <main
      id="ds4ch"
      role="main"
    >
      <nuxt
        id="main"
      />
    </main>
    <DS4CHPageFooter />
    <client-only>
      <PageCookiesWidget
        v-if="$features.embeddedMediaNotification && cookieConsentRequired"
        :klaro-manager="klaroManager"
        :klaro-config="klaroConfig"
        :cookie-consent-required="cookieConsentRequired"
      />
      <PageCookieConsent
        v-else-if="cookieConsentRequired"
      />
    </client-only>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';

  import DS4CHPageHeader from '@/components/DS4CH/DS4CHPageHeader';
  import DS4CHPageFooter from '@/components/DS4CH/DS4CHPageFooter';
  import canonicalUrlMixin from '@/mixins/canonicalUrl';
  import klaroMixin from '@/mixins/klaro.js';
  import versions from '../../pkg-versions';

  export default {
    name: 'DS4CHLayout',

    components: {
      ClientOnly,
      DS4CHPageHeader,
      DS4CHPageFooter,
      PageCookieConsent: () => import('@/components/page/PageCookieConsent'),
      PageCookiesWidget: () => import('@/components/page/PageCookiesWidget')
    },

    mixins: [
      canonicalUrlMixin,
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
          { rel: 'icon', href: require('@europeana/style/img/DS4CH/favicon.ico').default, type: 'image/x-icon' },
          { rel: 'preload', as: 'style', href: `https://cdn.jsdelivr.net/npm/bootstrap@${versions.bootstrap}/dist/css/bootstrap.min.css` },
          { rel: 'stylesheet', href: `https://cdn.jsdelivr.net/npm/bootstrap@${versions.bootstrap}/dist/css/bootstrap.min.css` },
          { rel: 'preload', as: 'style', href: `https://cdn.jsdelivr.net/npm/bootstrap-vue@${versions['bootstrap-vue']}/dist/bootstrap-vue.min.css` },
          { rel: 'stylesheet', href: `https://cdn.jsdelivr.net/npm/bootstrap-vue@${versions['bootstrap-vue']}/dist/bootstrap-vue.min.css` }
        ],
        meta: [
          { hid: 'og:url', property: 'og:url', content: this.canonicalUrl({ fullPath: true, locale: true }) }
        ],
        script: [
          this.klaroHeadScript
        ]
      };
    }
  };
</script>
