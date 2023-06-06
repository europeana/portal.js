<template>
  <b-button
    v-show="showFiltersToggle"
    data-qa="search filter button"
    class="icon-filter p-0 ml-3 my-3"
    :class="{ 'filters-applied' : hasSelectedFilters }"
    variant="light-flat"
    :aria-label="$t('actions.filter')"
    @click="toggleFilterSheet"
  />
</template>

<script>
  export default {
    name: 'FilterToggleButton',

    computed: {
      showFiltersToggle() {
        return this.$store.state.search.showFiltersToggle;
      },

      hasSelectedFilters() {
        return Object.keys(this.$route.query)
          .some((key) => ['qf', 'api', 'reusability', 'qa'].includes(key));
      }
    },

    methods: {
      toggleFilterSheet() {
        this.$store.commit('search/setShowFiltersSheet', !this.$store.state.search.showFiltersSheet);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/icons';

  .btn.icon-filter {
    &.filters-applied {
      position: relative;

      @at-root .top-search.open & {
        position: absolute;
      }

      &::after {
        content: '';
        width: 6px;
        height: 6px;
        background-color: $blue;
        outline: 2px solid rgba(255 255 255 / 90%);
        border-radius: 50%;
        position: absolute;
        right: 2px;
        top: 2px;
      }
    }

    @media (min-width: $bp-large) {
      display: none;
    }
  }
</style>
