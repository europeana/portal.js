<template>
  <b-dropdown
    variant="light"
    toggle-class="text-decoration-none"
  >
    <template slot="button-content">
      <span class="icon-language mr-2" />
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
  export default {
    name: 'LanguageSelector',

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
      availableLocales() {
        return this.$i18n.locales.filter((locale) => locale.code !== this.$i18n.locale);
      },
      removePaginationAtLanguageSwitch() {
        return ['galleries', 'stories'].some((routeNameBase) => {
          return this.$route.name === `${routeNameBase}___${this.$i18n.locale}`;
        });
      },
      selectedLocale() {
        return this.$i18n.locales.find((locale) => locale.code === this.$i18n.locale);
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

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .dropdown {
    ::v-deep .btn-light {
      font-size: $font-size-base;
      padding: 0.75rem 1rem;

      @media (min-width: $bp-wqhd) {
        font-size: 1.125rem;
      }
    }

    ::v-deep .dropdown-menu {
      max-height: 50vh;
      overflow: auto;

      @media (min-width: $bp-wqhd) {
        font-size: 1.125rem;
      }
    }

    ::v-deep .dropdown-toggle {
      color: $blue;
      padding-left: 1rem;
      padding-right: 1rem;
      font-weight: 400;
      text-transform: none;
    }
  }

  .icon-language {
    line-height: 1;
  }
</style>
