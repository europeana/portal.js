<template>
  <div>
    <b-link
      :to="linkGen('list')"
    >
      <img
        src="../../assets/img/search/list.svg"
        :alt="$t('searchViews.list')"
        :title="$t('searchViews.list')"
        data-qa="search list view toggle"
      >
    </b-link>
    <b-link
      :to="linkGen('grid')"
    >
      <img
        src="../../assets/img/search/grid.svg"
        :alt="$t('searchViews.grid')"
        :title="$t('searchViews.grid')"
        data-qa="search grid view toggle"
      >
    </b-link>
  </div>
</template>

<script>
  export default {
    methods: {
      linkGen: function (val) {
        return this.localePath({
          name: 'search', query: { ...this.$route.query, ...{ view: val } }
        });
      }
    }
  };
</script>
