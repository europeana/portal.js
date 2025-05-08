<template>
  <div>
    <SkipLink />
    <LandingPageHeader
      ref="pageHeader"
    />
    <main
      id="landing-layout"
      role="main"
    >
      <ProvideCanonicalUrl>
        <nuxt
          id="main"
        />
      </ProvideCanonicalUrl>
    </main>
    <LandingPageFooter />
    <client-only>
      <PageCookiesWidget
        :klaro-services="['auth-strategy', 'i18n', 'matomo', 'codepen']"
      />
    </client-only>
  </div>
</template>

<script>
  import LandingPageHeader from '@/components/landing/LandingPageHeader';
  import LandingPageFooter from '@/components/landing/LandingPageFooter';
  import ProvideCanonicalUrl from '@/components/provide/ProvideCanonicalUrl';
  import versions from '../../pkg-versions';
  import SkipLink from '@/components/generic/SkipLink';

  export default {
    name: 'LandingLayout',

    components: {
      LandingPageHeader,
      LandingPageFooter,
      PageCookiesWidget: () => import('@/components/page/PageCookiesWidget'),
      ProvideCanonicalUrl,
      SkipLink
    },

    head() {
      return {
        link: [
          { rel: 'icon', href: require('@europeana/style/img/favicon.ico').default, type: 'image/x-icon' },
          { rel: 'preload', as: 'style', href: `https://cdn.jsdelivr.net/npm/bootstrap@${versions.bootstrap}/dist/css/bootstrap.min.css` },
          { rel: 'stylesheet', href: `https://cdn.jsdelivr.net/npm/bootstrap@${versions.bootstrap}/dist/css/bootstrap.min.css` },
          { rel: 'preload', as: 'style', href: `https://cdn.jsdelivr.net/npm/bootstrap-vue@${versions['bootstrap-vue']}/dist/bootstrap-vue.min.css` },
          { rel: 'stylesheet', href: `https://cdn.jsdelivr.net/npm/bootstrap-vue@${versions['bootstrap-vue']}/dist/bootstrap-vue.min.css` }
        ]
      };
    }
  };
</script>
