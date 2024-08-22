<template>
  <div>
    <main
      role="main"
    >
      <nuxt />
    </main>
  </div>
</template>

<script>
  import versions from '../../pkg-versions';

  export default {
    name: 'ContentfulLayout',

    data() {
      return {
        contentfulExtensionsUiSdkVersion: '3.23.2'
      };
    },

    head() {
      return {
        link: [
          { rel: 'stylesheet', href: `https://cdn.jsdelivr.net/npm/bootstrap@${versions.bootstrap}/dist/css/bootstrap.min.css` },
          { rel: 'stylesheet', href: `https://cdn.jsdelivr.net/npm/bootstrap-vue@${versions['bootstrap-vue']}/dist/bootstrap-vue.min.css` }
        ],
        script: [
          { src: `https://cdn.jsdelivr.net/npm/contentful-ui-extensions-sdk@${this.contentfulExtensionsUiSdkVersion}/dist/cf-extension-api.js` }
        ],
        meta: [
          { hid: 'robots', name: 'robots', content: 'noindex' }
        ]
      };
    }
  };
</script>
