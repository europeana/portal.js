<template>
  <div>
    <b-nav class="d-inline-flex">
      <b-nav-item
        v-for="type, index in storyTypes"
        :key="index"
        class="d-none d-sm-block"
        link-classes="context-label text-decoration-none pr-0"
        :active="type.query === typeFromRoute"
        :to="{ ...$route , query: { ...$route.query, type: type.query}}"
      >
        {{ type.name }}
      </b-nav-item>
      <b-nav-item-dropdown
        class="d-sm-none"
        toggle-class="btn-light"
        variant="light"
        :text="storyTypes[0].name"
      >
        <b-dropdown-item
          v-for="type, index in storyTypes"
          :key="index"
          class="context-label"
          :active="type.query === typeFromRoute"
          :to="{ ...$route , query: { ...$route.query, type: type.query}}"
        >
          {{ type.name }}
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-nav>
  </div>
</template>

<script>
  export default {
    name: 'StoriesTypeFilter',

    data() {
      return {
        storyTypes: [
          { name: this.$t('stories.filter.viewAll'), query: undefined },
          { name: this.$t('stories.filter.stories'), query: 'story' },
          { name: this.$t('stories.filter.exhibitions'), query: 'exhibition' }
        ]
      };
    },

    computed: {
      typeFromRoute() {
        return this.$route.query?.type || undefined;
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';

::v-deep .nav-link {
  font-size: $font-size-small;

  &.active {
    color: $blue;
  }
}

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
