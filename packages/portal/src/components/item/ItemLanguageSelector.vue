<template>
  <transition
    name="fade"
  >
    <b-container
      fluid
      class="d-flex border-bottom align-items-center"
      data-qa="item language selector"
    >
      <b-container>
        <b-row>
          <b-col class="col-12 py-3 d-inline-flex align-items-center flex-wrap">
            <span>
              <span class="icon-translate pr-2" />
              <i18n
                v-if="fromTranslationError"
                path="multilingual.translateQuotaError"
                tag="span"
                class="pr-1"
                data-qa="translate item error"
              />
              <i18n
                v-else
                path="multilingual.translateLanguage"
                tag="span"
                class="pr-1"
                data-qa="translate item suggestion"
              >
                <b-dropdown
                  :text="$t('multilingual.other')"
                  variant="link"
                  toggle-class="multilingual-dropdown"
                  toggle-tag="span"
                  no-flip
                  class="multilingual-selector"
                  data-qa="item language dropdown"
                >
                  <b-dropdown-item
                    v-for="locale in translateLocales"
                    :key="locale.code"
                    class="multilingual-dropdown-item"
                    :to="translateParams(locale.code)"
                    :data-qa="`item language option ${locale.code}`"
                  >
                    {{ locale.name }}
                  </b-dropdown-item>
                </b-dropdown>
              </i18n>
            </span>
            <b-link
              v-if="metadataLanguage"
              :to="translateParams(null)"
              data-qa="remove item translation button"
            >
              <i18n
                path="multilingual.stopTranslating"
                tag="span"
                class="pr-1"
              >
                <span>{{ metadataLanguageLabel }}</span>
              </i18n>
            </b-link>
          </b-col>
        </b-row>
      </b-container>
      <b-button
        class="button-icon-only icon-clear"
        variant="light-flat"
        :aria-label="$t('actions.close')"
        data-qa="item language selector close button"
        @click="handleClose()"
      />
    </b-container>
  </transition>
</template>

<script>
  import locales from '@/mixins/locales';

  export default {
    name: 'ItemLanguageSelector',
    mixins: [
      locales
    ],
    props: {
      fromTranslationError: {
        type: Boolean,
        default: false
      },
      metadataLanguage: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        // "eu" language code not supported for translation
        translateLocales: this.$i18n.locales.filter(locale => locale.code !== 'eu'),
        hide: false
      };
    },
    computed: {
      metadataLanguageLabel() {
        return this.$i18n.locales.find(locale => locale.code === this.metadataLanguage)?.name;
      }
    },
    methods: {
      translateParams(language) {
        const query = {};
        if (language) {
          query.lang = language;
        }
        return { path: this.$route.path, query };
      },
      handleClose() {
        this.$emit('hidden');
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  .icon-translate::before {
    font-size: 1.4375rem;
  }

  .multilingual-selector {
    vertical-align: baseline;
  }

  .multilingual-dropdown-item {
    font-size: $font-size-small;
  }

  .fade-leave-active {
    transition: $standard-transition;
    opacity: 1;
  }

  .fade-leave-to {
    opacity: 0;
  }
</style>
