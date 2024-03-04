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
  import scrollToRouteHash from '@/mixins/scrollToRouteHash';
  import versions from '../../pkg-versions';

  export default {
    name: 'DS4CHLayout',

    components: {
      DS4CHPageHeader,
      DS4CHPageFooter
    },

    mixins: [
      scrollToRouteHash
    ],

    head() {
      return {
        link: [
          // TODO: add favicon
          { rel: 'stylesheet', href: `https://cdn.jsdelivr.net/npm/bootstrap@${versions.bootstrap}/dist/css/bootstrap.min.css` },
          { rel: 'stylesheet', href: `https://cdn.jsdelivr.net/npm/bootstrap-vue@${versions['bootstrap-vue']}/dist/bootstrap-vue.min.css` }
        ],
        meta: [
          { hid: 'og:url', property: 'og:url', content: this.$route.fullPath }
        ]
      };
    }
  };
</script>
