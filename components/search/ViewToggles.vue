<template>
  <b-nav
    align="right"
  >
    <b-nav-item
      v-for="view in views"
      :key="view"
      :to="linkGen(view)"
      :active="activeView == view"
      :data-qa="`search ${view} view toggle`"
      @click="selectView"
    >
      <img
        :src="iconSrc(view)"
        :alt="$t(`searchViews.${view}`)"
        :title="$t(`searchViews.${view}`)"
        :data-view="view"
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
      selectView: function (event) {
        this.activeView = event.target.getAttribute('data-view');
        this.$emit('changed', this.activeView);
      }
    }
  };
</script>
