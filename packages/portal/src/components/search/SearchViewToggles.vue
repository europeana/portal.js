<template>
  <b-dropdown
    id="search-view-toggles"
    ref="toggles"
    variant="light"
    no-flip
    no-caret
    data-qa="view toggle"
    :toggle-attrs="{ 'aria-label': $t('actions.changeView') }"
  >
    <b-tooltip
      id="search-view-toggles-tooltip"
      ref="tooltip"
      :disabled.sync="preventTooltip"
      placement="bottom"
      target="search-view-toggles"
    >
      {{ $t('actions.changeView') }}
    </b-tooltip>

    <template #button-content>
      <span
        :class="`icon-view-${value}`"
        @mouseover="handleHover"
        @touchstart="handleHover"
      />
    </template>
    <b-dropdown-item
      v-for="view in sortedViews"
      :key="view"
      v-b-tooltip.left="$t(`searchViews.${view}`)"
      :aria-label="$t(`searchViews.${view}`)"
      :data-qa="`${view} view option`"
      :to="{ ...$route, ...{ query: { ...$route.query, ...{ view: view } } } }"
      @click="selectView(view)"
    >
      <span
        :class="`icon-view-${view}`"
      />
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
  export default {
    name: 'SearchViewToggles',

    props: {
      /**
       * Selected search results view
       *
       * @values grid, list, mosaic
       */
      value: {
        type: String,
        default: 'grid'
      }
    },

    data() {
      return {
        debounceTooltipEnable: false,
        preventTooltip: false,
        views: ['list', 'grid', 'mosaic']
      };
    },

    computed: {
      sortedViews() {
        return [this.value, ...this.views.filter((view) => view !== this.value)];
      }
    },

    mounted() {
      // setup custom focusin handler as there are no native bootstrap events to hook into for the button
      this.$refs.toggles.$el.addEventListener('focusin', this.handleFocusin);
    },

    beforeDestroy() {
      this.$refs.toggles.$el.removeEventListener('focusin', this.handleFocusin);
    },

    methods: {
      selectView(view) {
        this.$cookies?.set('searchResultsView', view);
        this.$matomo?.trackEvent('View search results', 'Select view', view);

        // Pevent the tooltip from showing when foucs will be returned to the button.
        this.debounceTooltipEnable = true;
        this.setPreventTooltip(true);
      },
      setPreventTooltip(value) {
        if (value && value !== this.preventTooltip) {
          // Prevent the tooltip from showing. This is skipped if already prevented.
          this.$refs.tooltip.$emit('disable');
        } else if (value !== this.preventTooltip) {
          // Allow the tooltip to show. This is skipped if already allowed.
          // This is skipped the first time after a selection was made,
          // to stop the tooltip when the focus goes back to the dropdownbutton.
          if (!this.debounceTooltipEnable) {
            this.$refs.tooltip.$emit('enable');
          }

          // Ensure the next time focus is returned the tooltip can be allowed:
          this.debounceTooltipEnable = false;
        }
      },

      handleHover() {
        this.setPreventTooltip(false);
        // Now that the tooltip can be shown, trigger the show again.
        this.$root.$emit('bv::show::tooltip', 'search-view-toggles-tooltip');
      },
      handleFocusin() {
        // allow showing the tooltip again, but don't trigger a show event
        this.setPreventTooltip(false);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  ::v-deep .dropdown-menu {
    min-width: 0;
    border: none;
    box-shadow: $boxshadow;
    padding: 6px;
    margin: 0;
    transform: none !important;

    @media (min-width: $bp-4k) {
      padding: 9px;
    }

    &.show {
      display: flex;
      flex-direction: column;
    }

    [class*='icon-'] {
      font-size: $font-size-large;

      @media (min-width: $bp-4k) {
        font-size: $font-size-large-4k;
      }

      &::before {
        width: $font-size-large;
        display: inline-block;

        @media (min-width: $bp-4k) {
          width: $font-size-large-4k;
        }
      }
    }

    li:not(:last-child) {
      margin-bottom: 1rem;

      @media (min-width: $bp-4k) {
        margin-bottom: 1.5rem;
      }
    }

    .dropdown-item {
      color: $black;
      padding: 0;
      line-height: 1;

      &:hover,
      &:focus,
      &:active {
        background-color: transparent;
        color: $blue;
      }
    }
  }

  ::v-deep .btn-light.dropdown-toggle {
    color: $black;
    line-height: 1;
    padding: 6px;

    @media (min-width: $bp-4k) {
      padding: 9px;
    }

    @at-root .dropdown.show & {
      color: $black;
    }

    [class*='icon-'] {
      font-size: $font-size-large;
      display: inline-block;
      line-height: 1;
      width: $font-size-large;

      @media (min-width: $bp-4k) {
        font-size: $font-size-large-4k;
        width: $font-size-large-4k;
      }
    }
  }
</style>

<docs lang="md">
  ```jsx
  <SearchViewToggles />
  ```
</docs>
