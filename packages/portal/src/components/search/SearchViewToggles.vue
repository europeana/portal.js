<template>
  <b-form-group>
    <b-form-radio-group
      v-model="activeView"
      buttons
      button-variant="light-flat"
    >
      <b-form-radio
        v-for="view in views"
        :key="view"
        :value="view"
        :data-qa="`search ${view} view toggle`"
        :aria-labelledby="`${view}-label`"
        class="ml-3"
      >
        <span
          :id="`${view}-label`"
          class="visually-hidden"
        >
          {{ $t(`searchViews.${view}`) }}
        </span>
        <span
          v-b-tooltip.bottom
          :class="view"
          class="icon-view-toggle"
          :title="$t(`searchViews.${view}`)"
          :data-qa="`search ${view} view toggle icon`"
        />
      </b-form-radio>
    </b-form-radio-group>
  </b-form-group>
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
        activeView: this.value
      };
    },
    watch: {
      activeView() {
        this.$cookies?.set('searchResultsView', this.activeView);

        this.$matomo?.trackEvent('View search results', 'Select view', this.activeView);

        this.$router.push({ ...this.$route, ...{  query: { ...this.$route.query, ...{ view: this.activeView } } } });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/icon-font';

  .form-group {
    margin: 0;
    flex-shrink: 0;
  }

  .ml-3 {
    @media (min-width: $bp-4k) {
      margin-left: 1.5rem !important;
    }
  }

  .btn-group-toggle {
    position: relative;
    height: 2.25rem;
    align-items: center;

    @media (min-width: $bp-4k) {
      height: calc(1.5 * 2.25rem);
    }

    .icon-view-toggle {
      color: $mediumgrey;
      font-size: 1.5rem;

      @media (min-width: $bp-4k) {
        font-size: calc(1.5 * 1.5rem);
      }

      &::before {
        @extend %icon-font;

        content: '\e929';
        vertical-align: baseline;
        width: $font-size-large;
        display: inline-block;

        @media (min-width: $bp-4k) {
          width: $font-size-large-4k;
        }
      }

      &.grid::before {
        content: '\e92a';
      }

      &.mosaic::before {
        content: '\e94a';
      }
    }

    label.btn {
      background: none;
      border: 0;
      padding: 0;

      &:hover {
        box-shadow: none !important;

        .icon-view-toggle {
          color: $black;
        }
      }

      &.focus {
        box-shadow: none !important;
      }

      &.active {
        background: none !important;

        &:hover {
          cursor: default;
        }

        .icon-view-toggle {
          color: $blue;
        }
      }

      input[type='radio']:focus-visible ~ .icon-view-toggle {
        outline: auto;
        /* stylelint-disable */
        @media (-webkit-min-device-pixel-ratio: 0) {
          outline: -webkit-focus-ring-color auto 5px;
        }
        /* stylelint-enable */
      }
    }
  }
</style>

<docs lang="md">
  ```jsx
  <SearchViewToggles />
  ```
</docs>
