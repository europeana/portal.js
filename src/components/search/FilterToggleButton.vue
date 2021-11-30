<template>
  <b-button
    v-show="showFiltersToggle"
    data-qa="search filter button"
    class="filters-toggle ml-3 my-3"
    variant="light"
    :aria-label="$t('filter')"
    @click="toggleFilterSheet"
  />
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    computed: {
      ...mapState({
        showFiltersToggle: state => state.search.showFiltersToggle
      })
    },
    methods: {
      toggleFilterSheet() {
        this.$store.commit('search/setShowFiltersSheet', !this.$store.state.search.showFiltersSheet);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables.scss';
  @import '@/assets/scss/icons.scss';

  .btn.filters-toggle {
    @media (min-width: $bp-large) {
      display: none;
    }
    &:before {
      content: '\e948';
      font-size: 1.5rem;
      transition: $standard-transition;
    }
    &:hover:before {
      color: $innovationblue;
    }
  }
</style>
