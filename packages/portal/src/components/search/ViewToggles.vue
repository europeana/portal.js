<template>
  <b-form-group>
    <b-form-radio-group
      v-model="activeView"
      buttons
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
    name: 'ViewToggles',
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
        this.$cookies && this.$cookies.set('searchResultsView', this.activeView);

        this.$matomo && this.$matomo.trackEvent('View search results', 'Select view', this.activeView);

        this.$goto({ ...this.$route, ...{  query: { ...this.$route.query, ...{ view: this.activeView } } } });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';
  @import '@/assets/scss/icons';

  .form-group {
    margin: 0;
    flex-shrink: 0;
  }

  .btn-group-toggle {
    position: relative;
    height: 2.25rem;
    align-items: center;

    .icon-view-toggle {
      color: $mediumgrey;
      font-size: 1.5rem;

      &::before {
        @extend %icon-font;

        content: '\e929';
        vertical-align: baseline;
        width: 1.5rem;
        display: inline-block;
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
        outline: auto;
        /* stylelint-disable */
        @media (-webkit-min-device-pixel-ratio: 0) {
          outline: -webkit-focus-ring-color auto 5px;
        }
        /* stylelint-enable */
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
    }
  }
</style>

<docs lang="md">
  ```jsx
  <ViewToggles />
  ```
</docs>
