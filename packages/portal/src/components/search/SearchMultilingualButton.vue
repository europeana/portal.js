<template>
  <div>
    <b-button
      :id="buttonId"
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
    <NewFeatureTooltip
      :tooltip-target-id="buttonId"
      @disabled="newFeatureTooltipEnabled = false"
      @enabled="newFeatureTooltipEnabled = true"
    />
    <b-tooltip
      v-if="!newFeatureTooltipEnabled"
      placement="bottom"
      :target="buttonId"
    >
      {{ tooltipText }}
    </b-tooltip>
  </div>
</template>

<script>
  import useHideTooltips from '@/composables/hideTooltips.js';

  export default {
    name: 'SearchMultilingualButton',

    components: {
      NewFeatureTooltip: () => import('@/components/generic/NewFeatureTooltip')
    },

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
        // TODO: clean up when new feature tooltip expires
        newFeatureTooltipEnabled: false,
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
        console.log('detectTouchTap')
        this.touchTap = true;
      },
      toggle() {
        console.log('toggle')
        this.$matomo.trackEvent('Multilingual search', `${this.value ? 'Disabled' : 'Enabled'} multilingual search`, `${this.$i18n.locales.find((locale) => locale.code === this.$i18n.locale)?.name} multilingual search toggle`);

        if (this.$auth.loggedIn) {
          this.$emit('input', !this.value);
          this.hideTooltips();
        } else if (this.touchTap && this.touchTapCount === 0) {
          this.touchTapCount = 1;
          this.touchTap = false;
        } else {
          this.$emit('input', !this.value);
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
