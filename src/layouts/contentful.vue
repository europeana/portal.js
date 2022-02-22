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
        bodyAttrs: {
          class: 'white'
        },
        link: [
          { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,700italic,400,600,700&subset=latin,greek,cyrillic&display=swap', body: true },
          { rel: 'stylesheet', href: `https://unpkg.com/bootstrap@${versions.bootstrap}/dist/css/bootstrap.min.css` },
          { rel: 'stylesheet', href: `https://unpkg.com/bootstrap-vue@${versions['bootstrap-vue']}/dist/bootstrap-vue.min.css` }
        ],
        script: [
          { src: `https://unpkg.com/contentful-ui-extensions-sdk@${this.contentfulExtensionsUiSdkVersion}/dist/cf-extension-api.js` }
        ],
        meta: [
          { hid: 'robots', name: 'robots', content: 'noindex' }
        ]
      };
    }
  };
</script>
