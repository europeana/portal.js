<template>
  <b-container
    fluid
    class="border-bottom mt-3"
    data-qa="item language selector"
  >
    <b-container>
      <b-row>
        <b-col class="col-12 pb-3 d-inline-flex align-items-center flex-wrap">
          <span>
            <span class="icon-translate pr-2" />
            <i18n
              path="multilingual.currentLanguage"
              tag="span"
              class="pr-1"
              data-qa="translate item suggestion"
            >
              <span v-if="(!translated && itemLanguage === selectedLocale.code)"><!-- This comment removes white space
              -->{{ $t('multilingual.differentLanguage') }}<!-- This comment removes white space which gets underlined
              -->
              </span>
              <b-link
                v-else
                :to="translateParams(translated ? null : selectedLocale.code)"
              >
                <span><!-- This comment removes white space
                -->{{ languageToggle }}<!-- This comment removes white space which gets underlined
                -->
                </span>
              </b-link>
            </i18n>
          </span>
          <b-dropdown
            :text="$t('multilingual.other')"
            variant="link"
            toggle-class="multilingual-dropdown"
            toggle-tag="span"
            no-flip
            class="multilingual-selector"
          >
            <b-dropdown-item
              v-for="locale in availableLocalesForItem"
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
      },
      metadataLanguage: {
        type: String,
        default: null
      }
    },
    computed: {
      languageToggle() {
        return this.translated ? this.$t('multilingual.originalLanguage') : this.selectedLocale.name;
      },
      translated() {
        return this.metadataLanguage && this.itemLanguage !== this.metadataLanguage;
      },
      availableLocalesForItem() {
        return this.$i18n.locales.filter(i => this.metadataLanguage !== i.code);
      }
    },
    methods: {
      translateParams(language) {
        const query = {};
        if (language) {
          query.lang = language;
        }
        return { path: this.$route.path, query };
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';

.icon-translate:before {
  font-size: 1.4375rem;
}
.multilingual-dropdown-item {
  font-size: $font-size-small;
}
</style>
