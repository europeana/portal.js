<template>
  <div>
    <b-button
      :id="buttonId"
      v-b-tooltip.bottom="tooltipText"
      class="search-multilingual-button p-0 mr-2"
      :pressed="value"
      variant="light-flat"
      :aria-label="ariaLabelText"
      @click="toggle"
      @mouseleave="hideTooltips()"
      @touchstart="detectTouchTap()"
    >
      <span
        :class="{
          'icon-translate': value,
          'icon-translate-outlined': !value
        }"
      />
    </b-button>
  </div>
</template>

<script>
  import useHideTooltips from '@/composables/hideTooltips.js';

  export default {
    name: 'SearchMultilingualButton',

    props: {
      value: {
        type: Boolean,
        default: false
      }
    },

    setup() {
      const buttonId = 'search-multilingual-button';

      const { hideTooltips } = useHideTooltips(buttonId);

      return { buttonId, hideTooltips };
    },

    data() {
      return {
        touchTapCount: 0,
        touchTap: false
      };
    },

    computed: {
      ariaLabelText() {
        return this.value ? this.$t('search.multilingual.disable') : this.$t('search.multilingual.enable');
      },
      tooltipText() {
        if (this.selected) {
          return this.$t('search.multilingual.turnOffMultilingualSearch');
        } else if (this.$auth.loggedIn) {
          return this.$t('search.multilingual.turnOnMultilingualSearch');
        } else {
          return this.$t('search.multilingual.loginToUseMultilingualSearch');
        }
      }
    },

    methods: {
      detectTouchTap() {
        this.touchTap = true;
      },
      toggle() {
        this.$matomo.trackEvent('Multilingual search', `${this.value ? 'Disabled' : 'Enabled'} multilingual search`, `${this.$i18n.locales.find((locale) => locale.code === this.$i18n.locale)?.name} multilingual search toggle`);
        if (this.$auth.loggedIn) {
          this.$emit('input', !this.value);
          this.$cookies?.set('multilingualSearch', !this.value);
          this.hideTooltips();
        } else if (this.touchTap && this.touchTapCount === 0) {
          this.touchTapCount = 1;
          this.touchTap = false;
        } else {
          this.$keycloak.login();
          this.touchTapCount = 0;
        }
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .search-multilingual-button {
    font-size: $font-size-large;
    line-height: 1;

    @media (min-width: $bp-4k) {
      font-size: $font-size-large-4k;
    }

    &:hover {
      color: $black;

      .icon-translate:before {
        content: '\e93c';
      }
      .icon-translate-outlined:before {
        content: '\e970';
      }
    }
  }

</style>
