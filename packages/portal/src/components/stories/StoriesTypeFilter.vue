<template>
  <div data-qa="stories type filter">
    <b-nav class="d-inline-flex">
      <b-nav-item
        v-for="type, index in storyTypes"
        :key="index"
        class="d-none d-sm-block"
        link-classes="context-label text-decoration-none pr-0"
        :active="isTypeActive(type)"
        :to="routeForType(type)"
        :data-qa="`${type.name} type filter`"
      >
        {{ type.name }}
      </b-nav-item>
      <b-nav-item-dropdown
        class="d-sm-none"
        toggle-class="btn-light"
        variant="light"
        :text="activeType.name"
        right
      >
        <b-dropdown-item
          v-for="type, index in storyTypes"
          :key="index"
          class="context-label"
          :active="isTypeActive(type)"
          :to="routeForType(type)"
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
          { name: this.$t('stories.filter.viewAll') },
          { name: this.$t('stories.filter.stories'), query: 'story' },
          { name: this.$t('stories.filter.exhibitions'), query: 'exhibition' }
        ]
      };
    },

    computed: {
      activeType() {
        return this.storyTypes.find((type) => type.query === this.typeFromRoute) || this.storyTypes[0];
      },

      typeFromRoute() {
        return this.$route.query?.type;
      }
    },

    methods: {
      isTypeActive(type) {
        return type === this.activeType;
      },

      routeForType(type) {
        const newQuery = { ...this.$route.query };
        delete newQuery.page;
        if (type.query) {
          newQuery.type = type.query;
        } else {
          delete newQuery.type;
        }
        return { ...this.$route, query: newQuery };
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';

::v-deep .nav-link {
  font-size: $font-size-small;

  @media (min-width: $bp-4k) {
    font-size: $font-size-small-4k;
  }

  &.active {
    color: $blue;
  }
}

::v-deep .dropdown-toggle {
  &::after {
    padding-left: 0.5rem;
  }
}

::v-deep .dropdown-item {
  font-weight: 600;
  color: $darkgrey;

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
