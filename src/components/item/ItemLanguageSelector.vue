<template>
  <b-container
    fluid
    class="border-bottom mt-3"
  >
    <b-container>
      <b-row>
        <b-col class="col-12 pb-3 d-inline-flex align-items-center flex-wrap">
          <span>
            <span class="icon-language pr-2" />
            <i18n
              path="multilingual.currentLanguage"
              tag="span"
              class="pr-1"
            >
              <span v-if="itemLanguage === selectedLocale.code">
                {{ $t('multilingual.differentLanguage') }}
              </span>
              <b-link
                v-else
                @click="translated ? toOriginal() : translate(selectedLocale.code)"
              >
                {{ languageToggle }}
              </b-link>
            </i18n>
          </span>
          <b-dropdown
            :text="$t('multilingual.other')"
            variant="link"
            toggle-class="multilingual-dropdown"
            toggle-tag="span"
            no-flip
          >
            <b-dropdown-item
              v-for="locale in availableLocales"
              :key="locale.code"
              class="multilingual-dropdown-item"
              @click="translate(locale.code)"
            >
              {{ locale.name }}
            </b-dropdown-item>
          </b-dropdown>
        </b-col>
      </b-row>
    </b-container>
  </b-container>
</template>

<script>
  export default {
    name: 'ItemLanguageSelector',
    props: {
      itemLanguage: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        translated: !!this.$route.query.metadataLang || false
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
      translate(language) {
        this.translated = true;
        this.$router.push({ path: this.$route.path, query: { metadataLang: language || undefined } });
      },
      toOriginal() {
        this.translated = false;
        this.$router.push({ path: this.$route.path, query: { metadataLang: undefined } });
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';

.icon-language:before {
  font-size: 1.4375rem;
}
.multilingual-dropdown-item {
  font-size: $font-size-small;
}
</style>
