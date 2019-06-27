<template>
  <div>
    <b-link
      v-for="view in ['list', 'grid']"
      :key="view"
      :to="linkGen(view)"
    >
      <img
        :src="iconSrc(view)"
        :alt="$t(`searchViews.${view}`)"
        :title="$t(`searchViews.${view}`)"
        :data-qa="`search ${view} view toggle`"
      >
    </b-link>
  </div>
</template>

<script>
  export default {
    methods: {
      iconSrc: function(view) {
        // We require for webpack'd assets to work with dynamic paths
        return require(`../../assets/img/search/${view}.svg`);
      },
      linkGen: function (view) {
        return this.localePath({
          name: 'search', query: { ...this.$route.query, ...{ view: view } }
        });
      }
    }
  };
</script>
