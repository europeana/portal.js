<template>
  <b-nav
    align="right"
  >
    <b-nav-item
      v-for="view in views"
      :key="view"
      :to="linkGen(view)"
      :active="activeView === view"
      :data-qa="`search ${view} view toggle`"
      class="pl-3"
    >
      <span
        :class="view"
        class="icon-view-toggle"
        :title="$t(`searchViews.${view}`)"
      />
    </b-nav-item>
  </b-nav>
</template>

<script>
  import { BNav } from 'bootstrap-vue';

  export default {
    name: 'ViewToggles',
    components: {
      BNav
    },
    props: {
      value: {
        type: String,
        default: 'grid'
      },
      linkGenRoute: {
        type: Object,
        default: () => {
          return { name: 'search' };
        }
      }
    },
    data() {
      return {
        views: ['list', 'grid', 'image-grid'],
        activeView: this.value
      };
    },
    watch: {
      value() {
        this.activeView = this.value;
        if (this.$matomo) {
          this.$matomo.trackEvent('View search results', 'Select view', this.value);
        }
      }
    },
    methods: {
      linkGen(view) {
        return this.$path({ ...this.linkGenRoute, ...{ query: { ...this.$route.query, ...{ view } } } });
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

      &.image-grid::before {
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
      color: $black;
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
