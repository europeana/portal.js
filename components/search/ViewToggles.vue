<template>
  <div>
    <b-link
      :to="linkGen('list')"
    >
      <img
        src="../../assets/img/search/list.svg"
        :alt="$t('searchViews.list')"
        :title="$t('searchViews.list')"
      >
    </b-link>
    <b-link
      :to="linkGen('grid')"
    >
      <img
        src="../../assets/img/search/grid.svg"
        :alt="$t('searchViews.grid')"
        :title="$t('searchViews.grid')"
      >
    </b-link>
  </div>
</template>

<script>
  export default {
    props: {
      linkGen: {
        type: Function,
        default: (val) => {
          return val.toString();
        }
      }
    }
  };
</script>
