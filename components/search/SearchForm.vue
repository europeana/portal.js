<template>
  <b-form
    inline
    @submit.prevent="submitForm"
  >
    <b-input-group>
      <template
        v-if="pillLabel"
        v-slot:prepend
      >
        <SearchBarPill
          :text="pillLabel"
          :remove-link-label="$t('removeFilter', { filterLabel: pillLabel })"
          :remove-link-to="removeLinkTo"
        />
      </template>
      <b-form-input
        v-model="query"
        :aria-label="$t('search')"
        :placeholder="$t('searchPlaceholder')"
        name="query"
        data-qa="search box"
        @input="$emit('input', $event)"
      />
      <b-button
        type="submit"
        data-qa="search button"
        variant="primary"
      >
        <span class="sr-only">
          {{ $t('search') }}
        </span>
        <img
          src="../../assets/img/magnifier.svg"
          :alt="$t('search')"
        >
      </b-button>
    </b-input-group>
    <AutoComplete
      :options="options"
      @input="getSuggestions"
    />
  </b-form>
</template>

<script>
  import SearchBarPill from './SearchBarPill.vue';
  import AutoComplete from './AutoComplete.vue';

  export default {
    components: {
      SearchBarPill,
      AutoComplete
    },
    data() {
      return {
        inputQuery: this.query,
        options: null
      };
    },
    computed: {
      onSearchablePage() {
        return this.$store.state.search.active;
      },
      query: {
        get() {
          return this.onSearchablePage ? this.$store.state.search.query : '';
        },
        set(value) {
          this.inputQuery = value;
        }
      },
      routePath() {
        if (this.onSearchablePage) {
          return this.$route.path;
        }
        return this.localePath({ name: 'search' });
      },
      view() {
        return this.$store.getters['search/activeView'];
      },
      pillLabel() {
        return this.$store.state.search.pill;
      },
      removeLinkTo() {
        return {
          path: this.localePath({
            name: 'search'
          }),
          query: { ...this.$route.query, page: 1 }
        };
      }
    },
    updated() {
      this.inputQuery = this.query;
    },
    methods: {
      async submitForm() {
        const newRouteQuery = { ...this.$route.query, ...{ query: this.inputQuery, page: 1, view: this.view } };
        const newRoute = { path: this.routePath, query: newRouteQuery };
        await this.$router.push(newRoute);
      },

      async getSuggestions() {
        setTimeout(() => {
          this.options = {
            'http://data.europeana.eu/concept/base/83': 'Hello',
            'http://data.europeana.eu/concept/base/94': 'By Hello'
          };
        }, 500);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";

  .input-group {
    width: 100%;

    .input-group-prepend {
      align-items: center;
      background-color: $lightgrey;
      padding-left: .75rem;
      padding-right: .1rem;
      border-radius: 0.375rem 0 0 0.375rem;
    }
  }

  .form-control {
    background-color: $lightgrey;
    border-radius: $border-radius 0 0 $border-radius;
    margin-right: 0;
  }

  .btn {
    border-radius: 0 $border-radius $border-radius 0;

    img {
      display: flex;
    }
  }
</style>
