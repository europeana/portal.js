<template>
  <b-dropdown
    right
    variant="text-grey"
    toggle-class="text-decoration-none"
  >
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

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";

  .dropdown {
    margin-top: 20px;
    align-self: flex-end;

    @media (min-width: $bp-medium) {
      margin-top: 0;
    }
  }

  /deep/ .dropdown-menu {
    max-height: 250px;
    overflow: auto;
  }

  /deep/ .dropdown-toggle {
    padding-right: 0;
    color: $darkgrey;
    justify-content: flex-end;
    align-items: center;
    display: flex;
    border-radius: 0;

    @media (min-width: $bp-medium) {
      width: 160px;
    }
  }

  .language-icon {
    top: 7px;
    width: 31px;
    height: 32px;
    margin-right: 8px;
    background: url('../../assets/img/language.svg');
    display: inline-block;
    padding-top: 0;
    padding-bottom: 0;
  }
</style>
