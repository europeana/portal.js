<template>
  <div>
    <b-form-group
      align="right"
    >
      <b-form-radio
        v-for="view in views"
        v-model="value"
        :key="view"
        :value="view"
        :active="value === view"
        :data-qa="`search ${view} view toggle`"
        class="pl-3"
      >
        <span
          :class="view"
          class="icon-view-toggle"
          :title="$t(`searchViews.${view}`)"
        >
          {{ view }}
        </span>
      </b-form-radio>
    </b-form-group>
    <div class="mt-3">
      value: <strong>{{ value }}</strong>
    </div>
  </div>
</template>

<script>
  import { BNav } from 'bootstrap-vue';

  export default {
    name: 'ViewToggles',
    components: {
      BNav
    },
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
        views: ['list', 'grid', 'mosaic']
      };
    },
    watch: {
      value() {
        this.$router.push({ ...this.$route, ...{  query: { ...this.$route.query, ...{ view: this.value } } } });

        this.$cookies && this.$cookies.set('searchResultsView', this.value);

        this.$matomo && this.$matomo.trackEvent('View search results', 'Select view', this.value);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';
  @import '@/assets/scss/icons';

  .nav-link {
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
    }

    &:hover .icon-view-toggle,
    &.active .icon-view-toggle {
      color: $greyblack;
    }

    &.active {
      cursor: default;

      &::before {
        opacity: 0;
        transform: scale(0);
      }
    }
  }
</style>
