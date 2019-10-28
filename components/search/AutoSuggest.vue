<template>
  <b-form
    ref="form"
    inline
    @submit.prevent="submitForm"
  >
    <b-input-group class="auto-suggest">
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
        :autocomplete="isDisabled ? 'on' : 'off'"
        :aria-label="$t('search')"
        :placeholder="$t('searchPlaceholder')"
        name="query"
        data-qa="search box"
        @input="getSuggestions"
        @focus="activateDropdown"
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
      <b-list-group
        v-if="isActive"
        class="auto-suggest-dropdown"
        data-qa="search suggestions"
      >
        <!-- eslint-disable vue/no-v-html -->
        <b-list-group-item
          v-for="(value, name, index) in options"
          :key="index"
          :href="name"
          :class="{ 'hover': index === focus }"
          :value="value"
          data-qa="search suggestion"
          @mouseover="focus = index"
          @click="isActive = false"
          v-html="highlightResult(value)"
        />
        <!-- eslint-enable vue/no-v-html -->
      </b-list-group>
    </b-input-group>
  </b-form>
</template>

<script>
  import SearchBarPill from './SearchBarPill.vue';
  import match from 'autosuggest-highlight/match';
  import parse from 'autosuggest-highlight/parse';

  export default {
    name: 'AutoSuggest',

    components: {
      SearchBarPill
    },

    data() {
      return {
        query: null,
        focus: null,
        isActive: false,
        options: {}
      };
    },

    computed: {
      onSearchablePage() {
        return this.$store.state.search.active;
      },

      pillLabel() {
        return this.$store.state.search.pill;
      },

      routePath() {
        if (this.onSearchablePage) {
          return this.$route.path;
        }
        return this.localePath({ name: 'search' });
      },

      removeLinkTo() {
        return {
          path: this.localePath({
            name: 'search'
          }),
          query: { ...this.$route.query, page: 1 }
        };
      },

      isDisabled() {
        return !!(this.$store.state.entity && this.$store.state.entity.id);
      },

      view() {
        return this.$store.getters['search/activeView'];
      }
    },

    watch: {
      options() {
        this.isActive = !!this.options;
      },
      '$route.query'() {
        this.queryOnSearchablePage();
      }
    },

    mounted() {
      if (this.isDisabled) return;
      const form = this.$refs.form;
      form.addEventListener('keyup', this.navigateDropdown);
      document.addEventListener('mouseup', this.clickOutside);
      this.queryOnSearchablePage();
    },

    methods: {
      highlightResult(value) {
        const matches = match(value, this.query);
        const parts = parse(value, matches);
        const results = parts.map(part => {
          return part.highlight ? `<strong class="highlight">${part.text}</strong>` : part.text;
        });

        return results.join('');
      },
      clickOutside(event) {
        if (!this.isActive) return;

        const isChild = this.$el.contains(event.target);

        if (!isChild) {
          this.isActive = false;
        }
      },
      updateInputWithSelected() {
        this.$nextTick(() => {
          const hoveredElement = document.querySelector('.hover');
          if (!hoveredElement) return;
          this.query = hoveredElement.getAttribute('value');
        });
      },
      navigateDropdown(event) {
        switch (event.keyCode) {
        case 38:
          if (this.focus === null) {
            this.focus = 0;
          } else if (this.focus > 0) {
            this.focus--;
          } else if (this.focus === 0) {
            this.focus = null;
          }
          this.updateInputWithSelected();
          break;
        case 40:
          if (this.focus === null) {
            this.focus = 0;
          } else if (this.focus < Object.keys(this.options).length - 1) {
            this.focus++;
          }
          this.updateInputWithSelected();
          break;
        }
      },

      activateDropdown() {
        return !this.isActive && this.options;
      },

      queryOnSearchablePage() {
        this.onSearchablePage ? this.query = this.$store.state.search.query : this.query = '';
      },

      async submitForm() {
        const newRouteQuery = { ...this.$route.query, ...{ query: this.query, page: 1, view: this.view } };
        const newRoute = { path: this.routePath, query: newRouteQuery };
        this.isActive = false;
        await this.$router.push(newRoute);
      },

      // FAKE DATA
      async getSuggestions() {
        // If entity page, disable autosuggest
        if (this.isDisabled) return;
        // Fetch suggestions if characters are 3 or more
        if (this.query.length < 3) {
          this.options = {};
          return;
        }

        this.options = {
          'http://data.europeana.eu/concept/base/83': 'Hello',
          'http://data.europeana.eu/concept/base/94': 'By Hello'
        };
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";

  .auto-suggest {
    &-dropdown {
      position: absolute;
      top: 50px;
      width: 100%;
      z-index: 20;
      border-radius: 10px;

      a.list-group-item {
        border: 0;
        box-shadow: none;
        padding: .75rem 1.25rem;
        color: $black;

        &.hover {
          background-color: $lightgrey;
        }

        &:last-child {
          border-radius: 0 0 6px 6px;
        }

        /deep/.highlight {
          color: $blue;
        }
      }
    }
  }

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
