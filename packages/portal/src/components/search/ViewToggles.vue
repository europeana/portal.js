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

  .ml-3 {
    @media (min-width: $bp-4k) {
      margin-left: 1.5rem !important;
    }
  }

  .btn-group-toggle {
    padding: 0;
    position: relative;
    text-decoration: none;
    height: 2.25rem;
    align-items: center;

    @media (min-width: $bp-4k) {
      height: 7rem;
    }

    .icon-view-toggle {
      color: $grey;
      font-size: $font-size-large;
      line-height: 1;

      @media (min-width: $bp-4k) {
        font-size: 3.125rem;
      }

      &::before {
        @extend %icon-font;

        content: '\e929';
        vertical-align: baseline;
        width: $font-size-large;
        display: inline-block;

        @media (min-width: $bp-4k) {
          width: 3.125rem;
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
        box-shadow: none;

        .icon-view-toggle {
          color: $greyblack;
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

      &::before {
        background: $white;
        border-radius: 50%;
        box-sizing: border-box;
        content: '';
        display: block;
        opacity: 0;
        position: absolute;
        transform: scale(0);
        transition-duration: 0.15s;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-property: transform, opacity;
        z-index: -1;
      }

      &:not(.active):hover::before {
        opacity: 1;
        transform: scale(1);
        box-shadow: none;
        bottom: -10px;
        left: -10px;
        right: -10px;
        top: -10px;
      }

      &.active {
        background: none !important;

        &:hover {
          box-shadow: none !important;
          cursor: default;
        }

        .icon-view-toggle {
          color: $greyblack;
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
