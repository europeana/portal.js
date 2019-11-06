<template>
  <b-form
    ref="form"
    inline
    @submit.prevent="submitForm"
  >
    <b-input-group
      role="combobox"
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
        :autocomplete="enableAutoSuggest ? 'off' : 'on'"
        :placeholder="$t('searchPlaceholder')"
        name="query"
        data-qa="search box"
        role="searchbox"
        aria-autocomplete="list"
        aria-controls="autocomplete-results"
        :aria-label="$t('search')"
        @input="searchboxInput"
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
        :aria-hidden="!isActive"
      >
        <b-list-group-item
          v-if="isLoading"
          class="loading"
        >
          {{ $t('loadingResults') }}{{ $t('formatting.ellipsis') }}
        </b-list-group-item>

        <b-list-group-item
          v-for="(value, name, index) in suggestions"
          v-else
          :key="index"
          role="option"
          :aria-selected="index === focus"
          :to="suggestionLinkGen(name)"
          :class="{ 'hover': index === focus }"
          :value="localiseSuggestionLabel(value)"
          :data-index="index"
          @mouseover="focus = index"
          @focus="index === focus"
          @click="closeDropdown"
        >
          <template
            v-for="(part, partIndex) in highlightResult(value)"
          >
            <strong
              v-if="part.highlight"
              :key="partIndex"
              class="highlight"
              data-qa="highlighted"
            >{{ part.text }}</strong> <!-- Do not put onto a new line -->
            <span
              v-else
              :key="partIndex"
              data-qa="base"
            >{{ part.text }}</span> <!-- Do not put onto a new line -->
          </template>
        </b-list-group-item>
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

    props: {
      enableAutoSuggest: {
        type: Boolean,
        default: false
      },

      // Property names are identifiers, emitted when suggestion is selected.
      // Property values are lang maps for labels to display.
      // @example
      //     {
      //       'http://data.europeana.eu/concept/base/83': {
      //         en: 'World War I',
      //         es: 'Primera Guerra Mundial'
      //       },
      //       'http://data.europeana.eu/concept/base/1615': {
      //         en: 'gospel music',
      //         es: 'góspel'
      //       }
      //     }
      suggestions: {
        type: Object,
        default: () => {}
      },

      suggestionLinkGen: {
        type: Function,
        default: (val) => val
      }
    },

    data() {
      return {
        query: null,
        focus: null,
        isActive: false,
        isLoading: false
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

      view() {
        return this.$store.getters['search/activeView'];
      }
    },

    watch: {
      suggestions() {
        this.isActive = !!this.suggestions;
        this.isLoading = false;
      },
      '$route.query'() {
        this.queryOnSearchablePage();
        this.closeDropdown();
      }
    },

    mounted() {
      if (!this.enableAutoSuggest) return;

      this.queryOnSearchablePage();
      document.addEventListener('keyup', this.navigateDropdown);
      document.addEventListener('mouseup', this.clickOutside);
    },

    methods: {
      localiseSuggestionLabel(value) {
        if (value[this.locale]) {
          return value[this.locale];
        } else if (value.en) {
          return value.en;
        }
        return Object.values(value)[0];
      },

      highlightResult(value) {
        const string = this.localiseSuggestionLabel(value);
        const matches = match(string, this.query);
        const parts = parse(string, matches);
        return parts;
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
          } else if (this.focus < Object.keys(this.suggestions).length - 1) {
            this.focus++;
          }
          this.focusOnSuggestion();
          break;
        }
      },

      activateDropdown() {
        return !this.isActive && this.suggestions;
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

      async searchboxInput() {
        if (!this.enableAutoSuggest) return;
        // Uncomment this to show a loading indicator when suggestions are
        // awaiting update.
        // TODO: decide if we want it or not. Entity API responses are so fast,
        //       it's not really necessary.
        // this.isLoading = true;
        this.$emit('input', this.query);
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
