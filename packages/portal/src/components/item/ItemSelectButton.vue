<template>
  <div v-if="$features.itemMultiSelect">
    <b-button
      :id="tooltipTargetId"
      class="item-select-button p-0"
      :pressed="selected"
      variant="light-flat"
      :aria-label="ariaLabelText"
      @click="toggle"
      @mouseleave="$root.$emit('bv::hide::tooltip', tooltipId);"
      @focusout="hideTooltips"
    >
      <span
        :class="{
          'icon-select-circle': selected,
          'icon-select-circle-outlined': !selected,
          'target-animation': newFeatureTooltipEnabled
        }"
      />
    </b-button>
    <NewFeatureTooltip
      :tooltip-target-id="tooltipTargetId"
      @disabled="newFeatureTooltipEnabled = false"
      @enabled="newFeatureTooltipEnabled = true"
    />
    <b-tooltip
      v-if="!newFeatureTooltipEnabled"
      :id="tooltipId"
      placement="bottom"
      :target="tooltipTargetId"
    >
      {{ tooltipText }}
    </b-tooltip>
  </div>
</template>

<script>
  import useHideTooltips from '@/composables/hideTooltips.js';

  export default {
    name: 'ItemSelectButton',

    components: {
      NewFeatureTooltip: () => import('@/components/generic/NewFeatureTooltip')
    },

    setup() {
      const { hideTooltips } = useHideTooltips();
      return { hideTooltips };
    },

    data() {
      return {
        newFeatureTooltipEnabled: false,
        selected: false,
        tooltipId: 'item-select-button-tooltip',
        tooltipTargetId: 'item-select-button'
      };
    },

    computed: {
      ariaLabelText() {
        return this.selected ? this.$t('set.actions.cancelSelection') : this.$t('set.actions.selectItems');
      },
      tooltipText() {
        return this.selected ? this.$t('set.actions.cancelSelection') : this.$t('set.actions.clickToSelectItems');
      }
    },

    watch: {
      selected(newVal) {
        if (newVal) {
          window.addEventListener('keyup', this.handleKeyup);
        } else {
          window.removeEventListener('keyup', this.handleKeyup);
          this.$store.commit('set/setSelected', []);
        }
      }
    },

    methods: {
      handleKeyup(event) {
        if (event.key === 'Escape') {
          this.toggle();
        }
      },
      toggle() {
        this.hideTooltips();
        if (this.$auth.loggedIn) {
          this.selected = !this.selected;
          this.$emit('select', this.selected);
        } else {
          this.$keycloak.login();
        }
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .item-select-button {
    font-size: $font-size-large;
    line-height: 1;

    @media (min-width: $bp-4k) {
      font-size: $font-size-large-4k;
    }

    &:hover {
      color: $black;

      .icon-select-circle:before {
        content: '\e96f';
      }
      .icon-select-circle-outlined:before {
        content: '\e96e';
      }
    }

    .target-animation {
      color: $blue;
      animation: color-slide 3000ms ease-in-out infinite;

      @keyframes color-slide {
        0% {
          color: $blue;
        }
        35% {
          color: $black;
        }
        75% {
          color: $blue;
        }
        100% {
          color: $blue;
        }
      }
    }
  }
</style>

<docs lang="md">
  ```jsx
  <ItemSelectButton />
  ```
</docs>
