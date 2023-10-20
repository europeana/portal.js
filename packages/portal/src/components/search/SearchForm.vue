<template>
  <div
    v-show="showForm"
    ref="searchdropdown"
    class="open"
    :class="{
      'top-search': inTopNav,
      'suggestions-open': showSearchOptions
    }"
  >
    <b-button
      v-if="inTopNav"
      data-qa="back button"
      class="button-icon-only icon-back back-button"
      variant="light-flat"
      :aria-label="$t('header.backToMenu')"
      @click.prevent="handleHide"
    />
    <b-form
      ref="form"
      role="search"
      :class="{'search-form': !inTopNav}"
      :aria-label="$t('header.searchForm')"
      data-qa="search form"
      inline
      autocomplete="off"
      @submit.prevent="submitForm"
    >
      <b-input-group
        role="combobox"
        :aria-owns="showSearchOptions ? 'search-form-options' : null"
        :aria-expanded="showSearchOptions"
        class="auto-suggest pr-3"
      >
        <b-form-input
          ref="searchinput"
          v-model="query"
          :placeholder="$t('searchPlaceholder')"
          name="query"
          data-qa="search box"
          role="searchbox"
          aria-autocomplete="list"
          :aria-controls="showSearchOptions ? 'search-form-options' : null"
          :aria-label="$t('search.title')"
          @focus="showSearchOptions = true; suggestSearchOptions = true"
          @blur="suggestSearchOptions = false"
        />
      </b-input-group>
    </b-form>
    <b-button
      v-show="query"
      data-qa="clear button"
      class="button-icon-only icon-clear clear-button"
      variant="light-flat"
      :aria-label="$t('header.clearQuery')"
      @click="clearQuery"
    />
    <SearchFilterToggleButton
      v-if="inTopNav"
    />
    <div
      v-show="showSearchOptions"
      id="search-suggest-dropdown"
      class="auto-suggest-dropdown"
      data-qa="search form dropdown"
    >
      <SearchQueryOptions
        ref="searchoptions"
        :suggest="suggestSearchOptions && inTopNav && !onSearchableCollectionPage"
        :text="query"
        :submitting="submitting"
        :show-search-options="showSearchOptions"
        @select="(option) => handleSelect(option)"
        @hideForm="handleHide"
        @hideOptions="showSearchOptions = false"
      />
      <SearchThemeBadges
        v-if="showSearchThemeBadges"
        ref="quicksearch"
      />
    </div>
  </div>
</template>

<script>
  import SearchQueryOptions from './SearchQueryOptions';

  export default {
    name: 'SearchForm',

    components: {
      SearchQueryOptions,
      SearchFilterToggleButton: () => import('./SearchFilterToggleButton'),
      SearchThemeBadges: () => import('@/components/search/SearchThemeBadges')
    },

    props: {
      /**
       * If `true`, shows the form. If `false` hides the form.
       * Toggle control is outside this component
       */
      show: {
        type: Boolean,
        default: true
      },
      /**
       * If `true`, additional elements and styles are added
       */
      inTopNav: {
        type: Boolean,
        default: false
      },

      /**
       * If `true` defines hidability of the form
       * Used in keyboard navigation on 'Esc' key
       */
      hidableForm: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        query: null,
        showSearchOptions: false,
        showForm: this.show,
        suggestSearchOptions: false,
        selectedOption: null,
        submitting: null
      };
    },

    computed: {
      view() {
        return this.$store.getters['search/activeView'];
      },

      onSearchableCollectionPage() {
        // Auto suggest on search form will be disabled on entity pages.
        return !!this.$store.state.entity?.id && !!this.collectionLabel;
      },

      onSearchablePage() {
        return this.$store.state.search.active;
      },

      collectionLabel() {
        return this.$store.state.search.collectionLabel;
      },

      routePath() {
        return this.onSearchablePage ? this.$route.path : this.localePath({ name: 'search' });
      },

      showSearchThemeBadges() {
        return this.inTopNav && !this.onSearchableCollectionPage && !this.query;
      }
    },

    watch: {
      '$route.query.query'() {
        this.blurInput();
        this.showSearchOptions = false;
        this.initQuery();
      },
      '$route.path'() {
        this.showSearchOptions = false;
      },
      show(newVal) {
        this.showForm = newVal;
      }
    },

    mounted() {
      this.initQuery();
      this.inTopNav && this.$nextTick(() => {
        this.$refs.searchinput.$el.focus();
      });
    },

    methods: {
      initQuery() {
        this.query = this.$route.query.query;
      },

      async submitForm() {
        const queryToSubmit = this.selectedOption?.query || this.query;

        if (!this.selectedOption?.query) {
          // Set submitting state to track the no autosuggest option selected in SearchQueryOptions
          this.submitting = this.query;
        }

        const baseQuery = this.onSearchablePage ? this.$route.query : {};
        // `query` must fall back to blank string to ensure inclusion in URL,
        // which is required for analytics site search tracking
        const newRouteQuery = { ...baseQuery, ...{ page: 1, view: this.view, query: queryToSubmit || '' } };
        const newRoute = this.selectedOption?.link || { path: this.routePath, query: newRouteQuery };

        this.showSearchOptions = false;

        await this.$router.push(newRoute);
        // init query to update in case of selecting the already selected option
        this.initQuery();
      },

      clearQuery() {
        this.query = '';
        this.suggestions = {};

        this.$nextTick(() => {
          this.$refs.searchinput.$el.focus();
        });
      },

      handleSelect(option) {
        this.selectedOption = option;
        this.submitForm();
        this.selectedOption = null;
      },
      handleHide() {
        this.blurInput();
        this.showSearchOptions = false;
        if (this.hidableForm) {
          this.showForm = false;
          this.$store.commit('search/setShowSearchBar', false);
        }
      },
      blurInput() {
        this.$refs.searchinput.$el?.blur();
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/icons';

  .top-search {
    &.open {
      width: 100%;
      position: relative;

      .form-inline {
        align-items: flex-start;
        width: auto;

        .input-group {
          width: 100%;
          flex-wrap: nowrap;
          height: 3.4rem;
          box-shadow: 2px 2px 4px 0 rgba(0 0 0 / 8%);

          @media (min-width: $bp-4k) {
            height: calc(1.5 * 3.4rem);
          }

          .input-group-prepend {
            display: none;
          }
        }

        .form-control {
          background-color: $white;
          padding: 0.375rem 4.5rem 0.375rem 3.5rem;
          height: 3.4rem;
          box-shadow: none;
          border-radius: 0;
          color: $mediumgrey;
          width: 100%;

          @media (min-width: $bp-large) {
            padding-right: 1rem;
          }

          @media (min-width: $bp-4k) {
            padding: calc(1.5 * 0.375rem) calc(1.5 * 4.5rem) calc(1.5 * 0.375rem) calc(1.5 * 3.5rem);
            height: calc(1.5 * 3.4rem);
          }
        }
      }

      .search-query {
        box-shadow: $boxshadow-light;
        width: 100%;
        height: 3.5rem;
        font-size: 1rem;
        color: $mediumgrey;
        display: flex;
        align-items: center;
        position: relative;
        background: $white;

        .search {
          position: absolute;
          width: 100%;
          left: 0;
          top: 0;
          z-index: 99;
          height: 3.5rem;
          padding: 0.375rem 1rem 0.375rem 3.5rem;
          justify-content: flex-start;

          &:focus {
            color: $greyblack;
            background-color: $offwhite;

            ~ span {
              z-index: 99;
            }
          }

          &::before {
            left: 1rem;
            top: 1rem;
            position: absolute;
            width: 24px;
            height: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }

    .back-button {
      position: absolute;
      left: 1rem;
      top: 1rem;
      z-index: 99;

      @media (min-width: $bp-4k) {
        left: 1.5rem;
        top: 1.5rem;
      }
    }

    .clear-button {
      position: absolute;
      right: 3.5rem;
      top: 1rem;
      z-index: 99;

      @media (min-width: $bp-large) {
        right: 1rem;
      }

      @media (min-width: $bp-4k) {
        right: 1.5rem;
        top: 1.5rem;
      }
    }

    .icon-filter {
      position: absolute;
      right: 1rem;
      top: 0;
      z-index: 99;
    }

    .auto-suggest-dropdown {
      display: block;
      box-shadow: $boxshadow-light;
      position: absolute;
      top: 3.45rem;
      width: 100%;
      z-index: 20;
      border-radius: 0;
      background-color: $white;
      transition: $standard-transition;

      @media (min-width: $bp-4k) {
        top: calc(1.5 * 3.45rem);
      }
    }
  }

  .open:not(.top-search) {
    width: 100%;
    position: relative;

    .auto-suggest-dropdown {
      width: 100%;
      border-radius: 0 0 0.5em 0.5em;
      background-color: $white;
      overflow: hidden;
      animation: appear 750ms ease-in-out;
      position: absolute;
      z-index: 20;
      box-shadow: $boxshadow-light, $boxshadow-light-left;

      @media (min-width: $bp-4k) {
        font-size: 1.5rem;
      }
    }

    @keyframes appear {
      from {
        max-height: 0;
      }

      to {
        max-height: 100vh;
      }
    }

    &.suggestions-open {
      box-shadow: $boxshadow-light;

      .form-inline {
        border-radius: 0.5em 0.5em 0 0;
      }
    }

    .clear-button {
      position: absolute;
      right: 1rem;
      top: 1rem;
      z-index: 99;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    ::v-deep .list-group-item {
      padding: 1em 1.25em 1em 3.4em;
      font-size: 1rem;

      @media (min-width: $bp-4k) {
        font-size: 1.5rem;
      }

      &::before {
        font-size: 1.1em;
        left: 1em;
        top: 1em;
        width: 1.5em;
        height: 1.5em;
      }

      &.list-item-quick-search {
        padding: 0 1.25em 1.3125em;
      }
    }
  }

</style>

<docs lang="md">
  ```jsx
    <div style="background-color: #ededed; margin: -16px; padding: 16px;">
      <SearchForm />
    </div>
  ```
</docs>
