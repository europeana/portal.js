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
  import { version as bootstrapVersion } from 'bootstrap/package.json';
  import { version as bootstrapVueVersion } from 'bootstrap-vue/package.json';

  export default {
    name: 'ContentfulLayout',

    data() {
      return {
        bootstrapVersion,
        bootstrapVueVersion,
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
          { rel: 'stylesheet', href: `https://unpkg.com/bootstrap@${this.bootstrapVersion}/dist/css/bootstrap.min.css` },
          { rel: 'stylesheet', href: `https://unpkg.com/bootstrap-vue@${this.bootstrapVueVersion}/dist/bootstrap-vue.min.css` }
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
