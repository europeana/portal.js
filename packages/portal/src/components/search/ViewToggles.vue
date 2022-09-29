<template>
  <div>
    <b-form-group
      align="right"
    >
      <b-form-radio-group
        v-model="selectedValue"
        buttons
      >
        <b-form-radio
          v-for="view in views"
          :key="view"
          :value="view"
          :data-qa="`search ${view} view toggle`"
          class="pl-3"
        >
          <span
            :class="view"
            class="icon-view-toggle"
            :title="$t(`searchViews.${view}`)"
          />
        </b-form-radio>
      </b-form-radio-group>
    </b-form-group>
  </div>
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
        selectedValue: this.value
      };
    },
    watch: {
      selectedValue() {
        this.$cookies && this.$cookies.set('searchResultsView', this.selectedValue);

        this.$matomo && this.$matomo.trackEvent('View search results', 'Select view', this.selectedValue);

        this.$goto({ ...this.$route, ...{  query: { ...this.$route.query, ...{ view: this.selectedValue } } } });
      }
    }
  };
</script>

<style lang="scss">
  @import '@/assets/scss/variables';
  @import '@/assets/scss/icons';

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
      line-height: 1;
      background: none;
      border: 0;
      padding: 0;

      input {
        display: none;
      }

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
        }

        .icon-view-toggle {
          color: $greyblack;
        }
      }
    }
  }
</style>
