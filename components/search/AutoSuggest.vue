<template>
  <b-list-group
    v-show="isActive"
    :id="elementId"
    class="auto-suggest-dropdown"
    data-qa="search suggestions"
    role="listbox"
    :aria-label="$t('searchSuggestions')"
    :aria-hidden="!isActive"
  >
    <b-list-group-item
      v-if="showLoader && isLoading"
      class="loading"
    >
      {{ $t('loadingResults') }}{{ $t('formatting.ellipsis') }}
    </b-list-group-item>

    <b-list-group-item
      v-for="(val, name, index) in value"
      v-else
      :key="index"
      role="option"
      data-qa="search suggestion"
      :aria-selected="index === focus"
      :to="linkGen(name)"
      :class="{ 'hover': index === focus }"
      :data-index="index"
      @mouseover="focus = index"
      @focus="index === focus"
    >
      <template
        v-for="(part, partIndex) in highlightResult(val)"
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
        >{{ part.text }}</span> <!-- Do not put onto a new line -->
      </template>
    </b-list-group-item>
  </b-list-group>
</template>

<script>
  import match from 'autosuggest-highlight/match';
  import parse from 'autosuggest-highlight/parse';

  export default {
    name: 'AutoSuggest',

    props: {
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
      value: {
        type: Object,
        default: () => {}
      },

      query: {
        type: String,
        default: ''
      },

      linkGen: {
        type: Function,
        default: (val) => val
      },

      elementId: {
        type: String,
        default: null
      },

      inputRefName: {
        type: String,
        default: 'searchbox'
      },

      showLoader: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        focus: null,
        isActive: Object.keys(this.value || {}).length > 0,
        isLoading: false
      };
    },

    computed: {
      locale() {
        return this.$store.state.i18n.locale;
      },

      suggestionValues() {
        return Object.keys(this.value);
      },

      numberOfSuggestions() {
        return this.suggestionValues.length;
      },

      noSuggestionHasFocus() {
        return this.focus === null;
      },

      inputRef() {
        return this.$parent.$refs[this.inputRefName];
      },

      inputElement() {
        // refs may point to a component or direct to an HTML element
        return this.inputRef.$el ? this.inputRef.$el : this.inputRef;
      },

      firstSuggestionHasFocus() {
        return this.focus === 0;
      },

      lastSuggestionHasFocus() {
        return this.focus === (this.numberOfSuggestions - 1);
      },

      selectedSuggestionValue() {
        return this.suggestionValues[this.focus] || null;
      }
    },

    watch: {
      '$route.query'() {
        this.closeDropdown();
      },

      value() {
        this.isActive = true;
        this.isLoading = false;
        this.focus = null;
        this.selectSuggestion();
      },

      query() {
        this.isLoading = true;
      }
    },

    mounted() {
      this.inputElement.addEventListener('keyup', this.keyup);
      document.addEventListener('mouseup', this.clickOutside);
    },

    methods: {
      keyup(event) {
        if (!this.isActive) return;

        switch (event.keyCode) {
        case 9: // Tab key
        case 27: // Escape key
          this.closeDropdown();
          break;
        case 38: // Up key
          this.keyupUp();
          break;
        case 40: // Down key
          this.keyupDown();
          break;
        }
      },

      keyupUp() {
        if (this.noSuggestionHasFocus || this.firstSuggestionHasFocus) {
          this.focus = this.numberOfSuggestions - 1;
        } else {
          this.focus--;
        }

        this.selectSuggestion();
      },

      keyupDown() {
        if (this.noSuggestionHasFocus || this.lastSuggestionHasFocus) {
          this.focus = 0;
        } else {
          this.focus++;
        }

        this.selectSuggestion();
      },

      clickOutside(event) {
        if (!this.isActive) return;

        const isParent = (event.target === this.inputElement);
        const isChild = this.$el.contains(event.target);

        if (!(isParent || isChild)) {
          this.closeDropdown();
        }
      },

      // Localise a lang map
      //
      // Order of priority:
      // 1. User's UI language
      // 2. English
      // 3. First available value
      localiseSuggestionLabel(value) {
        if (value[this.locale]) {
          return value[this.locale];
        } else if (value.en) {
          return value.en;
        }
        return Object.values(value)[0];
      },

      // Highlight the user's query in a suggestion
      // FIXME: only re-highlight when new suggestions come in, not immediately
      //        after the query changes?
      highlightResult(value) {
        let matchingValues = {};

        // Find all the suggestion labels that match the query
        for (const locale in value) {
          const string = value[locale];
          const matches = match(string, this.query);
          if (matches.length > 0) {
            matchingValues[locale] = parse(string, matches);
          }
        }

        // If any suggestions match, return the localised one with higlight
        if (Object.values(matchingValues).length > 0) {
          return this.localiseSuggestionLabel(matchingValues);
        }

        // No matches, so return a localised suggestion without highlight
        return [{
          text: this.localiseSuggestionLabel(value),
          highlight: false
        }];
      },

      closeDropdown() {
        this.isActive = false;
        this.focus = null;
        this.selectSuggestion();
      },

      selectSuggestion() {
        this.$emit('select', this.selectedSuggestionValue);
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
      background-color: $white;

      a.list-group-item {
        border: 0;
        border-radius: 0;
        box-shadow: none;
        padding: .75rem 1.25rem;
        color: $black;

        &.hover {
          background-color: $offwhite;
        }

        &:last-child {
          border-radius: 0 0 6px 6px;
        }

        /deep/.highlight {
          color: $darkblue;
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
      background-color: $offwhite;
      padding-left: 0.75rem;
      padding-right: 0.1rem;
      border-radius: 0.375rem 0 0 0.375rem;
    }
  }

  .btn {
    border-radius: 0 $border-radius $border-radius 0;

    img {
      display: flex;
    }
  }
</style>
