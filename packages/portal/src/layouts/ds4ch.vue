<template>
  <div class="ds4ch-layout">
    <SkipLink />
    <DS4CHPageHeader
      ref="pageHeader"
    />
    <main
      id="ds4ch"
      role="main"
    >
      <ProvideCanonicalUrl>
        <nuxt
          id="main"
        />
      </ProvideCanonicalUrl>
    </main>
    <DS4CHPageFooter />
    <client-only>
      <PageCookiesWidget
        :klaro-services="['auth-strategy', 'i18n', 'matomo', 'hotjar']"
      />
    </client-only>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';

  import DS4CHPageHeader from '@/components/DS4CH/DS4CHPageHeader';
  import DS4CHPageFooter from '@/components/DS4CH/DS4CHPageFooter';
  import ProvideCanonicalUrl from '@/components/provide/ProvideCanonicalUrl';
  import SkipLink from '@/components/generic/SkipLink';
  import versions from '../../pkg-versions';

  export default {
    name: 'DS4CHLayout',

    components: {
      ClientOnly,
      DS4CHPageHeader,
      DS4CHPageFooter,
      PageCookiesWidget: () => import('@/components/page/PageCookiesWidget'),
      ProvideCanonicalUrl,
      SkipLink
    },

    head() {
      return {
        link: [
          { rel: 'icon', href: require('@europeana/style/img/DS4CH/favicon.ico').default, type: 'image/x-icon' },
          { rel: 'preload', as: 'style', href: `https://cdn.jsdelivr.net/npm/bootstrap@${versions.bootstrap}/dist/css/bootstrap.min.css` },
          { rel: 'stylesheet', href: `https://cdn.jsdelivr.net/npm/bootstrap@${versions.bootstrap}/dist/css/bootstrap.min.css` },
          { rel: 'preload', as: 'style', href: `https://cdn.jsdelivr.net/npm/bootstrap-vue@${versions['bootstrap-vue']}/dist/bootstrap-vue.min.css` },
          { rel: 'stylesheet', href: `https://cdn.jsdelivr.net/npm/bootstrap-vue@${versions['bootstrap-vue']}/dist/bootstrap-vue.min.css` }
        ]
      };
    }
  };
</script>
