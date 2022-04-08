<template>
  <b-button
    v-show="showFiltersToggle"
    data-qa="search filter button"
    class="icon-filter p-0 ml-3 my-3"
    :class="{ 'filters-applied' : hasSelectedFilters }"
    variant="light-flat"
    :aria-label="$t('filter')"
    @click="toggleFilterSheet"
  />
</template>

<script>
  import { mapState } from 'vuex';
  import themes from '@/plugins/europeana/themes';

  export default {
    computed: {
      ...mapState({
        showFiltersToggle: state => state.search.showFiltersToggle,
        userParams: state => state.search.userParams
      }),
      hasSelectedFilters() {
        return this.userParams?.qf || this.userParams?.reusability ||
          (this.userParams?.api && this.themeDefaultApi && this.userParams?.api !== this.themeDefaultApi);
      },
      collection() {
        return this.$store.getters['search/collection'];
      },
      themeDefaultApi() {
        return themes.find(theme => theme.qf === this.collection)?.filters?.api?.default;
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
  @import '@/assets/scss/variables';
  @import '@/assets/scss/icons';

  .btn.icon-filter {
    &.filters-applied {
      position: relative;

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
