<template>
  <b-container
    fluid
    class="border-bottom mt-3"
  >
    <b-container>
      <b-row>
        <b-col class="col-12 pb-3">
          <span class="icon-language pr-2" />
          <i18n
            path="multilingual.currentLanguage"
            tag="span"
          >
            <b-link
              @click="toggleTranslation"
            >
              {{ languageToggle }}
            </b-link>
          </i18n>
        </b-col>
      </b-row>
    </b-container>
  </b-container>
</template>

<script>
  export default {
    name: 'LanguageSelect',
    data() {
      return {
        translated: false
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
      },
      languageToggle() {
        return this.translated ? 'original language' : this.selectedLocale.name;
      }
    },
    methods: {
      toggleTranslation() {
        this.translated = !this.translated;
      }
    }
  };
</script>

<style lang="scss" scoped>
.icon-language:before {
  font-size: 1.4375rem;
}
</style>
