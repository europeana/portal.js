<template>
  <div>
    <b-dropdown
      data-qa="item language selector"
      :disabled="fromTranslationError"
    >
      <template #button-content>
        <span
          class="icon-translate-outlined pr-sm-1"
          :class="{'translation-applied': translationLanguage}"
        />
        <i18n
          v-if="translationLanguage"
          path="multilingual.viewingThisItemIn"
          tag="span"
          class="toggle-text align-middle"
          data-qa="item language selector toggle text translated"
        >
          <strong>{{ translationLanguageLabel }}</strong>
        </i18n>
        <span
          v-else
          class="toggle-text align-middle"
          data-qa="item language selector toggle text suggestion"
        >
          {{ $t('multilingual.viewItemInAnotherLanguage') }}
        </span>
      </template>
      <template v-if="translationLanguage">
        <b-dropdown-item
          :to="translateParams(null)"
          :target="null"
          data-qa="remove item translation button"
          link-class="stop-link"
        >
          <span class="icon-clear pr-2" />
          <i18n
            path="multilingual.stopViewingThisItemIn"
            tag="span"
          >
            <strong>{{ translationLanguageLabel }}</strong>
          </i18n>
        </b-dropdown-item>
        <b-dropdown-divider />
      </template>
      <b-dropdown-item
        v-for="locale in translateLocales"
        :key="locale.code"
        class="multilingual-dropdown-item"
        :to="translateParams(locale.code)"
        :data-qa="`item language option ${locale.code}`"
        @click="login"
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
  export default {
    name: 'ItemLanguageSelector',
    props: {
      /**
       * Translation request error
       */
      fromTranslationError: {
        type: Boolean,
        default: false
      },
      /**
       * Language the item is translated to
       */
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
          this.$keycloak.login();
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/mixins';

  .icon-translate-outlined {
    font-size: 1.25rem;
    line-height: 1;

    @media (min-width: $bp-small) {
      font-size: 1.125rem;
    }

    &.translation-applied {
      @media (max-width: ($bp-small - 1px)) {
        position: relative;
        @include status-indicator;

        &:after {
          top: -1px;
          right: -1px;
          outline-color: $offwhite;
        }
      }
    }
  }

  ::v-deep .dropdown-toggle {
    text-transform: none;
    padding: 0.4375rem 0.5rem;
    display: flex;
    align-items: center;

    @media (min-width: $bp-small) {
      padding: 0.4375rem 0.75rem 0.4375rem 0.6rem;
    }

    // dropdown is flipped up
    &:has(+ [x-placement='top-start']) {
      border-radius: 0 0 0.375rem 0.375rem;
    }

    &:after {
      padding-left: 0.25rem;
      margin: 2px 0 0 0;

      @media (min-width: $bp-small) {
        padding-left: 0.25rem;
      }
    }

    strong {
      font-weight: 700;
    }

    .toggle-text {
      // apply visually hidden styles for small bp only - keep text accessible
      @media (max-width: ($bp-small - 1px)) {
        clip: rect(0 0 0 0);
        clip-path: inset(50%);
        height: 1px;
        overflow: hidden;
        position: absolute;
        white-space: nowrap;
        width: 1px;
      }
    }
  }

  ::v-deep .dropdown-menu {
    width: auto;
    font-size: $font-size-small;
    max-height: 15rem;
    overflow-y: auto;
    overflow-x: hidden;
    margin-top: 0;
    border-radius: 0 0 $border-radius $border-radius;
    box-shadow: $boxshadow-large;
    border: 0;

    @media (min-width: $bp-small) {
      width: 100%;
    }

    // dropdown is flipped up
    &[x-placement='top-start'] {
      border-radius: $border-radius $border-radius 0 0;
    }
  }

  ::v-deep .stop-link {
    color: $darkgrey-light;
    display: flex;
    white-space: wrap;
    min-width: 15rem;

    &:active,
    &.active {
      color: $darkgrey-light;
      background-color: $lightgrey;
    }

    .icon-clear {
      font-size: $font-size-extrasmall;
      line-height: 1.875;
    }
  }
</style>

<docs lang="md">
  No language selected
  ```jsx
    <ItemLanguageSelector />
  ```
  Translation language set to Nederlands
  ```jsx
    <ItemLanguageSelector
      translation-language="nl"
    />
  ```
  Translation error
  ```jsx
    <ItemLanguageSelector
      :from-translation-error="true"
    />
  ```
</docs>
