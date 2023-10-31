<template>
  <transition
    appear
    name="fade"
  >
    <div
      v-show="showForm"
      ref="searchdropdown"
      class="search-dropdown open"
      :class="{
        'top-search': inTopNav,
        'suggestions-open': showSearchOptions
      }"
    >
      <div>
        <b-button
          v-if="inTopNav"
          v-b-tooltip.bottom
          data-qa="back button"
          class="button-icon-only icon-chevron back-button"
          variant="light-flat"
          :aria-label="$t('header.collapseSearchBar')"
          :title="$t('header.collapseSearchBar')"
          @click.prevent="handleHide"
        />
        <b-form
          ref="form"
          :role="!inSearchSidebar && 'search'"
          :class="{'search-form': !inTopNav}"
          :aria-label="$t('header.searchForm')"
          data-qa="search form"
          inline
          autocomplete="off"
          @submit.prevent="submitForm"
        >
          <b-input-group
            role="combobox"
            :aria-owns="showSearchOptions ? searchFormOptionsId : null"
            :aria-expanded="showSearchOptions"
            class="auto-suggest"
          >
            <b-form-input
              ref="searchinput"
              v-model="query"
              :placeholder="$t('searchPlaceholder')"
              name="query"
              data-qa="search box"
              role="searchbox"
              aria-autocomplete="list"
              :aria-controls="showSearchOptions ? searchFormOptionsId : null"
              :aria-label="$t('search.title')"
              @focus="showSearchOptions = true; suggestSearchOptions = true"
              @blur="suggestSearchOptions = false"
            />
          </b-input-group>
        </b-form>
        <b-button
          v-show="query"
          data-qa="clear button"
          class="clear-button"
          variant="light"
          @click="clearQuery"
        >
          <span class="icon-clear pr-lg-2" />
          {{ $t('actions.clear') }}
        </b-button>
      </div>
      <div
        v-show="showSearchOptions"
        class="auto-suggest-dropdown"
        data-qa="search form dropdown"
      >
        <SearchQueryOptions
          :id="searchFormOptionsId"
          ref="searchoptions"
          :suggest="suggestSearchOptions && (inTopNav || inSearchSidebar) && !onSearchableCollectionPage"
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
  </transition>
</template>

<script>
  import SearchQueryOptions from './SearchQueryOptions';

  export default {
    name: 'SearchForm',

    components: {
      SearchQueryOptions,
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
      },
      inSearchSidebar: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        showSearchOptions: false,
        showForm: this.show,
        suggestSearchOptions: false,
        selectedOption: null,
        submitting: null
      };
    },

    computed: {
      query: {
        get() {
          return this.$store.state.search.queryInputValue;
        },
        set(value) {
          this.$store.commit('search/setQueryInputValue', value);
        }
      },
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
        return (this.inTopNav || this.inSearchSidebar) && !this.onSearchableCollectionPage && !this.query;
      },

      searchFormOptionsId() {
        if (this.inSearchSidebar) {
          return 'search-form-options-sidebar';
        } else if (this.inTopNav) {
          return 'search-form-options-top-nav';
        } else {
          return 'search-form-options';
        }
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
      },
      showSearchOptions(newVal) {
        if (newVal === false && this.onSearchablePage) {
          if (this.query !== this.$route.query.query) {
            this.submitForm();
          }
        }
      }
    },

    mounted() {
      this.initQuery();
      !this.query && this.inTopNav && this.$nextTick(() => {
        this.$refs.searchinput.$el.focus();
      });
    },

    methods: {
      initQuery() {
        this.$store.commit('search/setQueryInputValue', this.$route.query.query);
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
        this.$store.commit('search/setQueryInputValue', '');
        this.suggestions = {};
        this.onSearchablePage && this.submitForm();
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
  @import '@europeana/style/scss/transitions';

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
          padding: 0.375rem 1rem 0.375rem 3.5rem;
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

      &::before {
        font-size: 0.5rem;
        transform: rotateX(180deg);
      }

      @media (min-width: $bp-4k) {
        left: 1.5rem;
        top: 1.5rem;
      }
    }

    .clear-button {
      position: absolute;
      right: 1rem;
      top: 0.5rem;
      z-index: 99;

      @media (max-width: ($bp-large - 1px)) {
        font-size: 0;
        right: 0.5rem;

        .icon-clear {
          line-height: 1.5;
          font-size: 0.875rem;
        }
      }

      @media (min-width: $bp-large) {
        right: 1rem;
      }

      @media (min-width: $bp-4k) {
        right: 1.5rem;
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
      width: 100%;
      z-index: 20;
      border-radius: 0;
      background-color: $white;
      transition: $standard-transition;
      border-top: 1px solid $bodygrey;

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
      right: 0.5rem;
      top: 0.5rem;
      z-index: 99;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0;

      .icon-clear {
        line-height: 1.5;
        font-size: 0.875rem;
      }
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
