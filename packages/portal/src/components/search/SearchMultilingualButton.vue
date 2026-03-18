<template>
  <div>
    <b-button
      :id="buttonId"
      class="search-multilingual-button p-0 mr-2"
      :pressed="value"
      variant="light-flat"
      :aria-label="ariaLabelText"
      @click="toggle"
      @mouseleave="showTooltip = false"
      @focusout="showTooltip = false"
      @touchstart="detectTouchTap()"
      @focus="showTooltip = true"
      @mouseover="showTooltip = true"
    >
      <span
        :class="{
          'icon-translate': value,
          'icon-translate-outlined': !value
        }"
      />
    </b-button>
    <b-tooltip
      placement="bottom"
      :show.sync="showTooltip"
      :target="buttonId"
      @show="(e) => { if (!showTooltip) { e.preventDefault() } } "
    >
      {{ tooltipText }}
    </b-tooltip>
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
        // Use custom showTooltip instead of hideTooltips composable for touch devices that keep the tooltip open when value is changed
        showTooltip: false,
        touchTapCount: 0,
        touchTap: false
      };
    },

    computed: {
      ariaLabelText() {
        return this.value ? this.$t('search.multilingual.disable') : this.$t('search.multilingual.enable');
      },
      tooltipText() {
        if (this.value) {
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
      trackEvent() {
        // TODO: mv up to parent input handler?
        this.$matomo?.trackEvent('Multilingual search', `${this.value ? 'Disabled' : 'Enabled'} multilingual search`, `${this.$i18n.locales.find((locale) => locale.code === this.$i18n.locale)?.name} multilingual search toggle`);
      },
      toggle() {
        if (this.$auth.loggedIn) {
          this.trackEvent();
          this.$emit('input', !this.value);
          this.showTooltip = false;
          // TODO: clean up when new feature tooltip expires
          this.hideTooltips();
        } else if (this.touchTap && this.touchTapCount === 0) {
          this.touchTapCount = 1;
          this.touchTap = false;
        } else {
          this.trackEvent();
          this.$emit('input', !this.value);
          this.touchTapCount = 0;
        }
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .btn-light-flat.search-multilingual-button {
    font-size: $font-size-large;
    line-height: 1;

    @media (min-width: $bp-4k) {
      font-size: $font-size-large-4k;
      margin-right: 0.75rem !important;
    }

    &:hover {
      color: $black;

      @media (hover: hover) {
        .icon-translate:before {
          content: '\e93c';
        }
        .icon-translate-outlined:before {
          content: '\e970';
        }
      }
    }
  }

</style>
