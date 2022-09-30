<template>
  <b-form-group
    align="right"
  >
    <b-form-radio-group
      v-model="activeView"
      buttons
    >
      <b-form-radio
        v-for="view in views"
        :key="view"
        :value="view"
        :data-qa="`search ${view} view toggle`"
        :yes="'okay'"
        no="nope"
        class="ml-3"
      >
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

<style lang="scss">
  @import '@/assets/scss/variables';
  @import '@/assets/scss/icons';

  .form-group {
    margin-bottom: 0;
    margin-top: 0;
  }

  .btn-group-toggle {
    padding: 0;
    position: relative;
    text-decoration: none;

    .icon-view-toggle {
      color: $grey;
      font-size: 1.5rem;
      z-index: 1;

      &::before {
        @extend %icon-font;

        content: '\e929';
      }

      &.grid::before {
        content: '\e92a';
      }

      &.mosaic::before {
        content: '\e94a';
      }
    }

    label.btn, {
      background: none;
      border: 0;
      padding: 0;

      &:hover {
        box-shadow: none;
        .icon-view-toggle {
          color: $greyblack;
        }
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
        bottom: -10px;
        left: -10px;
        right: -10px;
        top: -10px;
        z-index: -1;
      }

      &:hover::before {
        opacity: 1;
        transform: scale(1);
        box-shadow: none;
      }

      &.active {
        background: none !important;

        &:hover {
          box-shadow: none !important;
          cursor: default;

          &::before {
            opacity: 0;
          }
        }

        .icon-view-toggle {
          color: $greyblack;
        }
      }
    }
  }
</style>
