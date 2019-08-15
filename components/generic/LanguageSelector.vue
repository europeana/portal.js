<template>
  <b-dropdown>
    <template slot="button-content">
      {{ selectedLocale.name }}
    </template>
    <b-dropdown-item
      v-for="locale in availableLocales"
      :key="locale.code"
      :to="switchLocalePath(locale.code)"
    >
      {{ locale.name }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
  export default {
    name: 'LangSelector',

    computed: {
      availableLocales () {
        return this.$i18n.locales.filter(i => i.code !== this.$i18n.locale);
      },
      selectedLocale () {
        return this.$i18n.locales.find(locale => {
          return locale.code === this.$i18n.locale;
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  /deep/ .dropdown-menu {
    max-height: 250px;
    overflow: auto;
  }
</style>
