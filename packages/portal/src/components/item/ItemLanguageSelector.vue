<template>
  <div>
    <b-dropdown
      no-flip
      data-qa="item language selector"
      :disabled="fromTranslationError"
      @show="login"
    >
      <template #button-content>
        <span class="icon-translate pr-2" />
        <i18n
          v-if="translationLanguage"
          path="multilingual.viewingThisItemIn"
          tag="span"
        >
          <strong>{{ translationLanguageLabel }}</strong>
        </i18n>
        <span v-else>{{ $t('multilingual.viewItemInAnotherLanguage') }}</span>
      </template>
      <b-dropdown-item
        v-if="translationLanguage"
        :to="translateParams(null)"
        :target="null"
        data-qa="remove item translation button"
      >
        <i18n
          path="multilingual.stopTranslating"
          tag="span"
          class="pr-1"
        >
          <span>{{ translationLanguageLabel }}</span>
        </i18n>
      </b-dropdown-item>
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
    <i18n
      v-if="fromTranslationError"
      path="multilingual.translateQuotaError"
      tag="p"
      class="form-text text-muted"
      data-qa="translate item error"
    />
  </div>
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
        translateLocales: this.$i18n.locales.filter(locale => locale.code !== 'eu')
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
      login() {
        if (!this.$auth.loggedIn) {
          this.keycloakLogin();
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .icon-translate::before {
    font-size: 1.125rem;
  }

  ::v-deep .dropdown-toggle {
    text-transform: none;

    strong {
      font-weight: 700;
    }
  }

  ::v-deep .dropdown-menu {
    width: 100%;
    font-size: $font-size-small;
    max-height: 15rem;
    overflow-y: auto;
    overflow-x: hidden;
    margin-top: 0;
    border-radius: 0 0 0.375rem 0.375rem;
    box-shadow: $boxshadow-large;
    border: 0;
  }
</style>
