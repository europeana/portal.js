<template>
  <b-dropdown
    v-b-tooltip.bottom="$t('actions.changeView')"
    variant="light"
    no-flip
    no-caret
    data-qa="view toggle"
  >
    <template #button-content>
      <span
        :class="`icon-view-${value}`"
        :aria-label="$t('actions.changeView')"
      />
    </template>
    <b-dropdown-item
      v-for="view in views"
      :key="view"
      v-b-tooltip.left="$t(`searchViews.${view}`)"
      :aria-label="$t(`searchViews.${view}`)"
      :data-qa="`${view} view item`"
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

    computed: {
      views() {
        return ['list', 'grid', 'mosaic'].sort((a, b) => b === this.value);
      }
    },

    methods: {
      selectView(view) {
        this.$cookies?.set('searchResultsView', view);
        this.$matomo?.trackEvent('View search results', 'Select view', view);
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
    padding: 6px 6px 0;
    margin: 0;
    transform: none !important;

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

    .dropdown-item {
      color: $black;
      padding: 0;
      margin-bottom: 6px;
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
