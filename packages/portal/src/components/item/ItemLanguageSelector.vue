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
            <span class="d-inline-flex align-items-center flex-wrap">
              <span class="icon-translate pr-2" />
              <i18n
                v-if="fromTranslationError"
                path="multilingual.translateQuotaError"
                tag="span"
                class="pr-1"
                data-qa="translate item error"
              />
              <i18n
                v-else-if="!$auth.loggedIn"
                path="multilingual.loginToTranslate"
                tag="span"
                data-qa="translate item login suggestion"
              >
                <template #login>
                  <b-link
                    data-qa="log in button"
                    :href="localePath({ name: 'account-login', query: { redirect: $route.fullPath } })"
                    @click.prevent="keycloakLogin"
                  >
                    {{ $t('actions.login') }}<!-- This comment removes white space
                  -->
                  </b-link>
                </template>
              </i18n>
              <i18n
                v-else
                path="multilingual.translateLanguage"
                tag="span"
                data-qa="translate item suggestion"
              >
                <b-dropdown
                  :text="$t('multilingual.other')"
                  variant="link"
                  toggle-class="multilingual-dropdown border-0"
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
              <b-button
                v-b-tooltip.bottom
                :title="$t('multilingual.translateMetadata')"
                class="icon-info-outline tooltip-button px-2"
                variant="light-flat"
              />
            </span>
            <b-link
              v-if="translationLanguage"
              :to="translateParams(null)"
              data-qa="remove item translation button"
            >
              <i18n
                path="multilingual.stopTranslating"
                tag="span"
                class="pr-1"
              >
                <span>{{ translationLanguageLabel }}</span>
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
  import keycloak from '@/mixins/keycloak';
  import locales from '@/mixins/locales';

  export default {
    name: 'ItemLanguageSelector',
    mixins: [
      keycloak,
      locales
    ],
    props: {
      fromTranslationError: {
        type: Boolean,
        default: false
      },
      translationLanguage: {
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
      translationLanguageLabel() {
        return this.$i18n.locales.find(locale => locale.code === this.translationLanguage)?.name;
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
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/transitions';
  @import '@europeana/style/scss/icon-font';

  .icon-translate::before {
    font-size: 1.4375rem;
  }

  .multilingual-selector {
    vertical-align: baseline;
  }

  ::v-deep .multilingual-dropdown {
    padding: 0;
    color: $greyblack;
    text-decoration: underline;

    &::after {
      @extend %icon-font;

      // icon-chevron
      content: '\e91b';
      font-size: 0.5rem;
      border: none;
      margin-left: 0.25rem;
    }
  }

  .multilingual-dropdown-item {
    font-size: $font-size-small;
  }
</style>
