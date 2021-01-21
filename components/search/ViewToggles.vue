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
      @click="selectView(view)"
    >
      <i
        :class="view"
        class="icon-view-toggle"
        :title="$t(`searchViews.${view}`)"
      />
    </b-nav-item>
  </b-nav>
</template>

<script>
  export default {
    name: 'ViewToggles',
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
        views: ['list', 'grid'],
        activeView: this.value
      };
    },
    watch: {
      value() {
        this.activeView = this.value;
      }
    },
    methods: {
      linkGen(view) {
        return this.$path({ ...this.linkGenRoute, ...{ query: { ...this.$route.query, ...{ view } } } });
      },
      selectView(view) {
        if (view !== this.activeView) {
          this.activeView = view;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/variables.scss';
  @import '../../assets/scss/icons.scss';

  .nav-link {
    padding: 0;
    position: relative;
    text-decoration: none;

    .icon-view-toggle {
      color: $grey;
      font-size: 1.5rem;
      z-index: 1;

      &:before {
        @extend .icon-font;
        content: '\e929';
      }

      &.grid:before {
        content: '\e92a';
      }
    }

    &:before {
      background: $white;
      border-radius: 50%;
      position: absolute;
      bottom: -10px;
      left: -10px;
      right: -10px;
      top: -10px;
      z-index: -1;
    }

    &:hover .icon-view-toggle,
    &.active .icon-view-toggle {
      color: $black;
    }

    &.active {
      cursor: default;
      &:before {
        opacity: 0;
        transform: scale(0);
      }
    }
  }
</style>
