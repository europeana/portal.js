<template>
  <div>
    <b-dropdown
      variant="light"
      :text="storyTypes[0].name"
    >
      <b-dropdown-item
        v-for="type in storyTypes"
        :key="type.name"
        class="context-label"
        :active="type === selectedStoryType"
        :to="type.query ? `/stories?type=${type.query}` : '/stories'"
      >
        {{ type.name }}
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
  export default {
    name: 'StoriesTypeFilter',

    data() {
      return {
        storyTypes: [
          { name: this.$t('stories.filter.viewAll'), query: null },
          { name: this.$t('stories.filter.stories'), query: 'story' },
          { name: this.$t('stories.filter.exhibitions'), query: 'exhibition' }
        ]
      };
    },

    computed: {
      typeFromRoute() {
        return this.$route.query?.type || null;
      },
      selectedStoryType() {
        return this.storyTypes.find(type => type.query === this.typeFromRoute);
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';

  ::v-deep .dropdown-item {
    font-weight: 600;
    color: $mediumgrey;

    &:hover {
      background-color: transparent;
      color: $black;
    }

    &.active {
      background-color: transparent;
      color: $blue;
    }
  }
</style>
