<template>
  <b-form
    ref="form"
    inline
    @submit.prevent="submitForm"
  >
    <b-input-group
      role="combobox"
      aria-haspopup="listbox"
      aria-owns="autocomplete-results"
      :aria-expanded="isActive"
      class="auto-suggest"
    >
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
        ref="searchbox"
        v-model="query"
        :autocomplete="isDisabled ? 'on' : 'off'"
        :placeholder="$t('searchPlaceholder')"
        name="query"
        data-qa="search box"
        role="searchbox"
        aria-autocomplete="list"
        aria-controls="autocomplete-results"
        :aria-label="$t('search')"
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
        v-show="isActive"
        id="autocomplete-results"
        class="auto-suggest-dropdown"
        data-qa="search suggestions"
        role=”listbox”
        :aria-hidden="!isActive"
      >
        <b-list-group-item
          v-if="isLoading"
          class="loading"
        >
          {{ $t('loadingResults') }}...
        </b-list-group-item>
        <!-- eslint-disable vue/no-v-html -->
        <b-list-group-item
          v-for="(value, name, index) in options"
          v-else
          :key="index"
          role="option"
          :aria-selected="index === focus"
          :href="name"
          :class="{ 'hover': index === focus }"
          :value="value[locale]"
          :data-qa="`search suggestion ${value[locale].toLowerCase()} link`"
          :data-index="index"
          @mouseover="focus = index"
          @focus="index === focus"
          @click="closeDropdown"
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
        isLoading: false,
        options: {}
      };
    },

    computed: {
      locale() {
        return this.$store.state.i18n.locale;
      },

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

      document.addEventListener('keyup', this.navigateDropdown);
      document.addEventListener('mouseup', this.clickOutside);
      this.queryOnSearchablePage();
    },

    methods: {
      highlightResult(value) {
        const string = value[this.locale];
        const matches = match(string, this.query);
        const parts = parse(string, matches);
        const results = parts.map(part => {
          return part.highlight ? `<strong class="highlight">${part.text}</strong>` : part.text;
        });

        return results.join('');
      },

      closeDropdown() {
        this.isActive = false;
        this.focus = null;
      },

      clickOutside(event) {
        if (!this.isActive) return;

        const isChild = this.$el.contains(event.target);

        if (!isChild) {
          this.closeDropdown();
        }
      },

      focusOnSuggestion() {
        if (!this.focus) return;

        const selectedSuggestion = this.$el.querySelector(`[data-index="${this.focus}"]`);
        selectedSuggestion.focus();
      },
      navigateDropdown(event) {
        if (!this.isActive) return;

        switch (event.keyCode) {
        case 9: // Tab Key
          this.clickOutside(event);
          break;
        case 27: // Escape Key
          this.closeDropdown();
          break;
        case 38: // Up Key
          if (this.focus === null) {
            this.focus = 0;
          } else if (this.focus > 0) {
            this.focus--;
          } else if (this.focus === 0) {
            this.focus = null;
            this.$refs.searchbox.focus();
          }
          this.focusOnSuggestion();
          break;
        case 40: // Down key
          if (this.focus === null) {
            this.focus = 0;
          } else if (this.focus < Object.keys(this.options).length - 1) {
            this.focus++;
          }
          this.focusOnSuggestion();
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
        this.closeDropdown;
        await this.$router.push(newRoute);
      },

      // FAKE DATA
      async getSuggestions() {
        // If entity page, disable autosuggest
        if (this.isDisabled) return;
        // Fetch suggestions if characters are 3 or more
        if (this.query.length < 3) {
          this.focus = null;
          this.options = {};
          return;
        }

        this.isLoading = true;

        const promise = await new Promise(resolve => {
          setTimeout(() => {
            this.isLoading = false;
            const fakeData = {
              '/en/entity/topic/83': {
                en: 'World War I',
                fr: 'Première Guerre mondiale'
              },
              '/en/entity/topic/94': {
                en: 'Architecture',
                fr: 'Architecture'
              }
            };
            resolve(fakeData);
          }, 500);
        });

        this.options = promise;

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
        border-radius: 0;
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

      .loading {
        font-size: 0.75rem;
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
