<template>
  <b-dropdown
    variant="light"
    toggle-class="text-decoration-none"
  >
    <template slot="button-content">
      {{ selectedLocale.name }}
    </template>

    <b-dropdown-item
      v-for="locale in availableLocales"
      :key="locale.code"
      :href="localeHref(locale.code)"
      :data-qa="`${locale.name} language option`"
    >
      {{ locale.name }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
  import locales from '@/mixins/locales';
  export default {
    name: 'LangSelector',
    mixins: [
      locales
    ],

    head() {
      return {
        // TODO: remove this? nuxt-i18n sets lang attribute to full ISO locale,
        //       e.g. en-GB w/o this
        htmlAttrs: {
          lang: this.$i18n.locale
        }
      };
    },

    computed: {
      removePaginationAtLanguageSwitch() {
        return ['galleries', 'stories'].some((routeNameBase) => {
          return this.$route.name === `${routeNameBase}___${this.$i18n.locale}`;
        });
      }
    },

    methods: {
      localeHref(code) {
        const route = { ...this.$route, query: { ...this.$route.query } };
        delete route.name;
        if (this.removePaginationAtLanguageSwitch) {
          delete route.query.page;
        }
        return this.localePath(route, code);
      }
    }
  };
</script>
