<template>
  <div>
    <slot />
  </div>
</template>

<script>
  import { computed } from 'vue';

  // This would ideally be a composable, but couldn't get that working wrt
  // provision of baseUrl, i18n and route from Options API setup function where
  // there is no vue/nuxt context available, and lack of v3 helpers like useContext
  export default {
    name: 'ProvideCanonicalUrl',

    provide() {
      return {
        canonicalUrl: computed(() => this.canonicalUrl)
      };
    },

    data() {
      return {
        canonicalUrl: {}
      };
    },

    head() {
      return {
        link: [
          { hreflang: 'x-default', rel: 'alternate', href: this.canonicalUrl.withOnlyQuery }
        ],
        meta: [
          { hid: 'og:url', property: 'og:url', content: this.canonicalUrl.withBothLocaleAndQuery }
        ]
      };
    },

    watch: {
      $route: {
        handler() {
          this.setCanonicalUrl();
        },
        deep: true
      },
      '$i18n.locale'() {
        this.setCanonicalUrl();
      }
    },

    created() {
      this.setCanonicalUrl();
    },

    methods: {
      pathToUrl(path) {
        return `${this.$config.app.baseUrl}${path}`;
      },

      pathWithoutLocale(path) {
        if (this.$route.path === `/${this.$i18n.locale}`) {
          return path.replace(this.$i18n.locale, '');
        } else if (path.startsWith(`/${this.$i18n.locale}/`)) {
          return path.slice(3);
        }
        return path;
      },

      setCanonicalUrl() {
        this.canonicalUrl = {
          withBothLocaleAndQuery: this.pathToUrl(this.$route.fullPath),
          withOnlyQuery: this.pathToUrl(this.pathWithoutLocale(this.$route.fullPath)),
          withOnlyLocale: this.pathToUrl(this.$route.path),
          withNeitherLocaleNorQuery: this.pathToUrl(this.pathWithoutLocale(this.$route.path))
        };
      }
    }
  };
</script>
