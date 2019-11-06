<template>
  <b-list-group
    v-show="isActive"
    :id="elementId"
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
      v-for="(val, name, index) in value"
      v-else
      :key="index"
      role="option"
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
          data-qa="base"
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
        default: 'autocomplete-results'
      },

      inputRefName: {
        type: String,
        default: 'searchbox'
      }
    },

    data() {
      return {
        focus: null,
        isActive: false,
        isLoading: false
      };
    },

    computed: {
      locale() {
        return this.$store.state.i18n.locale;
      },

      numberOfSuggestions() {
        return Object.keys(this.value).length;
      },

      noSuggestionHasFocus() {
        return this.focus === null;
      },

      firstSuggestionHasFocus() {
        return this.focus === 0;
      },

      lastSuggestionHasFocus() {
        return this.focus === (this.numberOfSuggestions - 1);
      }
    },

    watch: {
      '$route.query'() {
        this.closeDropdown();
      },

      value() {
        this.isActive = true;
        this.focus = null;
        this.$emit('select', null);
      }
    },

    mounted() {
      this.$parent.$refs[this.inputRefName].$el.addEventListener('keyup', this.navigateDropdown);
      document.addEventListener('mouseup', this.clickOutside);
    },

    methods: {
      clickOutside(event) {
        if (!this.isActive) return;
        const isChild = this.$el.contains(event.target);
        if (!isChild) {
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
        this.$emit('select', null);
      },

      focusOnSuggestion() {
        // if (!this.focus) return;
        const selected = Object.keys(this.value)[this.focus];
        this.$emit('select', selected);
        // FIXME: this is problematic because it causes the view port to scroll
        //        in addition to suggestion highlighting
        // const selectedSuggestion = this.$el.querySelector(`[data-index="${this.focus}"]`);
        // selectedSuggestion.focus();
      },

      navigateDropdown(event) {
        if (!this.isActive) return;

        switch (event.keyCode) {
        case 9: // Tab Key
          this.closeDropdown();
          break;
        case 27: // Escape Key
          this.closeDropdown();
          break;
        case 38: // Up Key
          if (this.noSuggestionHasFocus || this.firstSuggestionHasFocus) {
            this.focus = this.numberOfSuggestions - 1;
          } else {
            this.focus--;
          }
          this.focusOnSuggestion();
          break;
        case 40: // Down key
          if (this.noSuggestionHasFocus || this.lastSuggestionHasFocus) {
            this.focus = 0;
          } else {
            this.focus++;
          }
          this.focusOnSuggestion();
          break;
        }
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
</style>
