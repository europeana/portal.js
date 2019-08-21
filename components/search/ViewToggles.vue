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
      <img
        :src="iconSrc(view)"
        :alt="$t(`searchViews.${view}`)"
        :title="$t(`searchViews.${view}`)"
      >
    </b-nav-item>
  </b-nav>
</template>

<script>
  export default {
    props: {
      active: {
        type: String,
        default: ''
      }
    },
    data: function () {
      return {
        activeView: this.active,
        views: ['list', 'grid']
      };
    },
    methods: {
      iconSrc: function(view) {
        // `require` for webpack'd assets to work with dynamic paths
        return require(`../../assets/img/search/${view}.svg`);
      },
      linkGen: function (view) {
        return this.localePath({
          name: 'search', query: { ...this.$route.query, ...{ view: view } }
        });
      },
      selectView: function (view) {
        if (view !== this.activeView) {
          this.activeView = view;
          this.$emit('changed', this.activeView);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";

  .nav-link {
    padding: 0;
    position: relative;

    img {
      filter: invert(0.5);
    }

    &:before {
      content: '';
      display: block;
      opacity: 0;
      position: absolute;
      transition-duration: 0.15s;
      transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);
      z-index: -1;
      bottom: -10px;
      left: -10px;
      right: -10px;
      top: -10px;
      background: $extralightgrey;
      border-radius: 50%;
      box-sizing: border-box;
      transform: scale(0);
      transition-property: transform, opacity;
    }

    &:hover:before {
      opacity: 1;
      transform: scale(1);
    }

    &:hover img,
    &.active img {
      filter: invert(0);
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
