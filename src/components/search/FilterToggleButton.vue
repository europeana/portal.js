<template>
  <b-button
    v-show="showFiltersToggle"
    data-qa="search filter button"
    class="icon-filter p-0 ml-3 my-3"
    variant="light-flat"
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
  @import '@/assets/scss/variables';
  @import '@/assets/scss/icons';

  .btn.icon-filter {
    @media (min-width: $bp-large) {
      display: none;
    }
  }
</style>
