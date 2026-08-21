<template>
  <div>
    <a
      class="skip-main"
      href="#main"
      data-qa="main content accessibility link"
    >
      {{ $t('layout.skipToMain') }}
    </a>
    <LandingPageHeader
      ref="pageHeader"
      :logo-src="config?.header?.logoSrc"
      :navigation-links="config?.header?.navigationLinks"
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
    <LandingPageFooter
      :more-info="config?.footer?.moreInfo"
    />
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

  const configs = [
    {
      pages: 'apis',
      header: {
        logoSrc: require('@europeana/style/img/landing/apis-logo.svg'),
        navigationLinks: [
          { url: '#europeana-ap-is-and-how-they-work-together', i18nPath: 'landing.apis.header.navigation.europeanaApis' },
          { url: '#try-it-out', i18nPath: 'landing.apis.header.navigation.apiDemo' },
          { url: '#find-inspiration', i18nPath: 'landing.apis.header.navigation.findInspiration' },
          { url: '#frequently-asked-questions-faq', i18nPath: 'landing.apis.header.navigation.faq' }
        ]
      },
      footer: {
        moreInfo: {
          name: { i18nPath: 'landing.apis.footer.name' },
          links: [
            { url: 'https://europeana.atlassian.net/wiki/external/MGU4MjI4ZjA2MmM0NDg3M2JjODQ2ZTZjYzBhZWNhZTg', i18nPath: 'landing.apis.footer.navigation.apiDocumentation' },
            { url: 'https://www.europeana.eu/account/api-keys', i18nPath: 'landing.apis.footer.navigation.requestApiKey' },
            { url: 'https://europeana.atlassian.net/wiki/spaces/EF/pages/2360508417/Europeana+API+FAQ', i18nPath: 'footer.navigation.faq' },
            { url: 'mailto:api@europeana.eu', i18nPath: 'landing.apis.footer.navigation.contactUs' },
            { url: 'https://www.europeana.eu/rights', i18nPath: 'footer.navigation.terms' },
            { url: 'https://www.europeana.eu/rights/privacy-statement', i18nPath: 'footer.navigation.privacy' }
          ]
        }
      }
    },
    {
      pages: ['black-history-month', 'womens-history-month'],
      footer: {
        moreInfo: {
          name: { i18nPath: 'footer.navigation.MoreInfoLabel' },
          links: [
            { url: '/rights', i18nPath: 'footer.navigation.terms' },
            { url: '/rights/privacy-statement', i18nPath: 'footer.navigation.privacy' },
            { url: '/rights/accessibility-policy', i18nPath: 'footer.navigation.accessibility' },
            { url: '/rights/cookies-policy', i18nPath: 'footer.navigation.cookies' }
          ]
        }
      }
    }
  ];

  // const findConfig = () => {
  //   return configs.find((config) => [].concat(config.pages).includes(this.pageIdentifier))
  // }

  export default {
    name: 'LandingLayout',

    components: {
      LandingPageHeader,
      LandingPageFooter,
      PageCookiesWidget: () => import('@/components/page/PageCookiesWidget'),
      ProvideCanonicalUrl
    },

    data() {
      return {
        pageIdentifier: this.$route?.params?.pathMatch || this.$config?.app?.homeLandingPageSlug
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
        ]
      };
    },

    // created() {
    //   console.log('config', this.config)
    // },

    computed: {
      config() {
        return configs.find((config) => [].concat(config.pages).includes(this.pageIdentifier));
      }
      // footerMoreInfo() {
      //   if (this.pageIdentifier === PAGE_IDENTIFIER_APIS) {
      //     // return {
      //     //   name: this.$t('landing.apis.footer.name'),
      //     //   links: [
      //     //     { url: 'https://europeana.atlassian.net/wiki/external/MGU4MjI4ZjA2MmM0NDg3M2JjODQ2ZTZjYzBhZWNhZTg', i18nPath: 'landing.apis.footer.navigation.apiDocumentation' },
      //     //     { url: 'https://www.europeana.eu/account/api-keys', i18nPath: 'landing.apis.footer.navigation.requestApiKey' },
      //     //     { url: 'https://europeana.atlassian.net/wiki/spaces/EF/pages/2360508417/Europeana+API+FAQ', i18nPath: 'footer.navigation.faq' },
      //     //     { url: 'mailto:api@europeana.eu', i18nPath: 'landing.apis.footer.navigation.contactUs' },
      //     //     { url: 'https://www.europeana.eu/rights', i18nPath: 'footer.navigation.terms' },
      //     //     { url: 'https://www.europeana.eu/rights/privacy-statement', i18nPath: 'footer.navigation.privacy' }
      //     //   ]
      //     // };
      //   } else if ([PAGE_IDENTIFIER_BHM, PAGE_IDENTIFIER_WHM].includes(this.pageIdentifier)) {
      //     return {
      //       name: this.$t('footer.navigation.MoreInfoLabel'),
      //       links: [
      //         { url: '/rights', i18nPath: 'footer.navigation.terms' },
      //         { url: '/rights/privacy-statement', i18nPath: 'footer.navigation.privacy' },
      //         { url: '/rights/accessibility-policy', i18nPath: 'footer.navigation.accessibility' },
      //         { url: '/rights/cookies-policy', i18nPath: 'footer.navigation.cookies' }
      //       ]
      //     };
      //   } else {
      //     return null;
      //   }
      // },

      // headerLogoSrc() {
      //   return this.pageIdentifier === PAGE_IDENTIFIER_APIS ? require('@europeana/style/img/landing/apis-logo.svg') : null;
      // },

      // headerNavigationLinks() {
      //   if (this.pageIdentifier === PAGE_IDENTIFIER_APIS) {
      //     return [
      //       { url: '#europeana-ap-is-and-how-they-work-together', i18nPath: 'landing.apis.header.navigation.europeanaApis' },
      //       { url: '#try-it-out', i18nPath: 'landing.apis.header.navigation.apiDemo' },
      //       { url: '#find-inspiration', i18nPath: 'landing.apis.header.navigation.findInspiration' },
      //       { url: '#frequently-asked-questions-faq', i18nPath: 'landing.apis.header.navigation.faq' }
      //     ];
      //   } else {
      //     return null;
      //   }
      // }
    }
  };
</script>
