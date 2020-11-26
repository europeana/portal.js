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
      :to="switchLocalePath(locale.code)"
      :data-qa="`${locale.name} language option`"
    >
      {{ locale.name }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
  export default {
    name: 'LangSelector',
    head() {
      return {
        htmlAttrs: {
          lang: this.$i18n.locale
        }
      };
    },

    computed: {
      availableLocales() {
        return this.$i18n.locales.filter(i => i.code !== this.$i18n.locale);
      },
      selectedLocale() {
        return this.$i18n.locales.find(locale => {
          return locale.code === this.$i18n.locale;
        });
      }
    }
  };
</script>
