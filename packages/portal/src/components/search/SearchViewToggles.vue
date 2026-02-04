<template>
  <b-dropdown
    id="search-view-toggles"
    variant="light"
    no-flip
    no-caret
    data-qa="view toggle"
    :toggle-attrs="{ 'aria-label': $t('actions.changeView') }"
  >
    <b-tooltip
      placement="bottom"
      target="search-view-toggles"
      @show="handleTooltipShow"
    >
      {{ $t('actions.changeView') }}
    </b-tooltip>
    <template #button-content>
      <span
        :class="`icon-view-${value}`"
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
        views: ['list', 'grid', 'mosaic'],
        showTooltip: true
      };
    },

    computed: {
      sortedViews() {
        return [this.value, ...this.views.filter((view) => view !== this.value)];
      }
    },

    methods: {
      handleTooltipShow(event) {
        if (!this.showTooltip) {
          event.preventDefault();
          // after preventing tooltip show, enable tooltip show again for subsequent event
          this.showTooltip = true;
        }
      },
      selectView(view) {
        this.$cookies?.set('searchResultsView', view);
        this.$matomo?.trackEvent('View search results', 'Select view', view);
        // prevent showing tooltip when selecting a view (dropdown hides and sets focus on dropdown toggle)
        this.showTooltip = false;
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
