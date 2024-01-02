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
      id="default"
      role="main"
    >
      <nuxt
        id="main"
      />
    </main>
    <DS4CHPageFooter />
  </div>
</template>

<script>
  import DS4CHPageHeader from '@/components/DS4CH/DS4CHPageHeader';
  import DS4CHPageFooter from '@/components/DS4CH/DS4CHPageFooter';
  import canonicalUrlMixin from '@/mixins/canonicalUrl';
  import versions from '../../pkg-versions';

  export default {
    name: 'DS4CHLayout',

    nuxtI18n: false,

    components: {
      DS4CHPageHeader,
      DS4CHPageFooter
    },

    mixins: [
      canonicalUrlMixin
    ],

    head() {
      const APP_SITENAME = 'Data space for cultural heritage';

      // TODO: add i18n head when decided page should be multilingual

      return {
        title: APP_SITENAME,
        link: [
          // TODO: add favicon
          { rel: 'stylesheet', href: `https://cdn.jsdelivr.net/npm/bootstrap@${versions.bootstrap}/dist/css/bootstrap.min.css` },
          { rel: 'stylesheet', href: `https://cdn.jsdelivr.net/npm/bootstrap-vue@${versions['bootstrap-vue']}/dist/bootstrap-vue.min.css` }
        ],
        meta: [
          { hid: 'description', name: 'description', content: APP_SITENAME },
          { hid: 'og:description', property: 'og:description', content: APP_SITENAME },
          { hid: 'og:url', property: 'og:url', content: this.$route.fullPath }
        ]
      };
    },

    mounted() {
      this.scrollToRouteHash();
    },

    methods: {
      // same thing that browsers do anyway, but taking into account that the
      // static page header will obscure the top of the element in question
      //
      // TODO: ideally this should also be called when using client-side navigation,
      //       not just when layout is first mounted, e.g. to handle hash
      //       properly when using back/forward. however, some of the elements
      //       may load late due to api requests, so how to do so?
      scrollToRouteHash() {
        if (this.$route.hash) {
          this.$scrollTo?.(this.$route.hash, {
            duration: 0,
            easing: 'linear',
            offset: -this.$refs.pageHeader.$el.clientHeight
          });
        }
      }
    }
  };
</script>
