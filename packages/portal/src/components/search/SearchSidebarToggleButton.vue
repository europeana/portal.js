<template>
  <b-button
    v-show="showSidebarToggle"
    data-qa="search sidebar button"
    class="icon-filter p-0 m-3"
    :class="{ 'filters-applied' : hasSelectedFilters }"
    variant="light-flat"
    :aria-label="$t('actions.filter')"
    @click="toggleSearchSidebar"
  />
</template>

<script>
  export default {
    name: 'SearchSidebarToggleButton',

    computed: {
      showSidebarToggle() {
        return this.$store.state.search.showSidebarToggle;
      },

      hasSelectedFilters() {
        return Object.keys(this.$route.query)
          .some((key) => ['qf', 'api', 'reusability', 'qa'].includes(key));
      }
    },

    methods: {
      toggleSearchSidebar() {
        this.$store.commit('search/setShowSearchSidebar', !this.$store.state.search.showSearchSidebar);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/mixins';

  .btn.icon-filter {
    &.filters-applied {
      position: relative;
      @include status-indicator;

      @at-root .top-search.open & {
        position: absolute;
      }

    }

    @media (min-width: $bp-large) {
      display: none;
    }
  }
</style>
