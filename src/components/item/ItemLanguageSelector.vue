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
              data-qa="translate item suggestion"
            >
              <span v-if="!translated && itemLanguage === selectedLocale.code">
                {{ $t('multilingual.differentLanguage') }}
              </span>
              <NuxtLink
                v-else
                :to="translateParams(translated ? null : selectedLocale.code)"
              >
                {{ languageToggle }}
              </NuxtLink>
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
              :to="translateParams(locale.code)"
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
  import locales from '@/mixins/locales';

  export default {
    name: 'ItemLanguageSelector',
    mixins: [
      locales
    ],
    props: {
      itemLanguage: {
        type: String,
        default: null
      }
    },
    computed: {
      languageToggle() {
        return this.translated ? this.$t('multilingual.originalLanguage') : this.selectedLocale.name;
      },
      translated() {
        if (this.$route.query.metadataLang) {
          return this.itemLanguage !== this.$route.query.metadataLang;
        }
        return false;
      }
    },
    methods: {
      translateParams(language) {
        const queryParams = {};
        if (language) {
          queryParams.metadataLang = language;
        }
        return { path: this.$route.path, query: queryParams };
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
