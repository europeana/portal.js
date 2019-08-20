<template>
  <b-dropdown>
    <template slot="button-content">
      <i class="language-icon" />
      {{ selectedLocale.name }}
    </template>

    <template test>
      <b-dropdown-item
        v-for="locale in availableLocales"
        :key="locale.code"
        :to="switchLocalePath(locale.code)"
        :data-qa="`${locale.name} language option`"
      >
        {{ locale.name }}
      </b-dropdown-item>
    </template>
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

  /deep/ .dropdown-toggle {
    padding-left: 40px;
  }

  .language-icon {
    position: absolute;
    left: 10px;
    top: 7px;
    width: 18px;
    height: 28px;
    margin-right: 8px;
    background: url('../../assets/img/language.svg');
  }
</style>
