<template>
  <b-col
    class="col-search-sidebar col-3"
    :class="{ open: showSearchSidebar, hide: hideSearchSidebar }"
  >
    <div
      class="search-sidebar-backdrop"
      @click="toggleSearchSidebar"
    />
    <b-container
      class="search-sidebar"
      data-qa="search sidebar"
    >
      <section role="search">
        <client-only>
          <b-row
            class="search-sidebar-header d-lg-none"
          >
            <b-button
              data-qa="close filters button"
              class="close-sidebar-button mr-1 ml-auto text-uppercase d-flex align-items-center"
              variant="light-flat"
              :aria-label="$t('header.closeSidebar')"
              @click="toggleSearchSidebar"
            >
              <span class="icon-clear pr-2" />
              {{ $t('actions.close') }}
            </b-button>
          </b-row>
          <SearchForm
            class="d-lg-none"
            parent="search-sidebar"
          />
          <b-row
            class="d-flex justify-content-between align-items-center flex-nowrap"
          >
            <span
              class="d-flex"
            >
              <b-button
                aria-controls="search-query-builder search-query-builder-mobile"
                :aria-expanded="showAdvancedSearch ? 'true' : 'false'"
                class="search-toggle query-builder-toggle ml-3 my-3 flex-grow-1"
                :class="{ 'open': showAdvancedSearch }"
                data-qa="toggle advanced search button"
                variant="link"
                @click="$emit('showAdvancedSearch', !showAdvancedSearch)"
              >
                {{ $t('search.advanced.show', { 'showOrHide': showAdvancedSearch ? $t('actions.hide') : $t('actions.show') }) }} {{ advancedSearchQueryCount ? `(${advancedSearchQueryCount})` : '' }}
              </b-button>
              <b-button
                v-b-tooltip.bottom
                :title="$t('search.advanced.tooltip.advancedSearch')"
                class="icon-info-outline p-0 tooltip-button ml-1 mr-3"
                variant="light-flat"
              />
            </span>
          </b-row>
          <transition
            name="fade"
          >
            <SearchQueryBuilder
              v-show="showAdvancedSearch"
              id="search-query-builder-mobile"
              class="d-lg-none"
              @show="(show) => $emit('showAdvancedSearch', show)"
            />
          </transition>
          <slot />
        </client-only>
      </section>
    </b-container>
  </b-col>
</template>

<script>
  import ClientOnly from 'vue-client-only';

  export default {
    name: 'SearchSidebar',

    components: {
      ClientOnly,
      SearchForm: () => import('./SearchForm'),
      SearchQueryBuilder: () => import('./SearchQueryBuilder')
    },

    props: {
      advancedSearchQueryCount: {
        type: Number,
        default: 0
      },
      showAdvancedSearch: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        hideSearchSidebar: true
      };
    },
    computed: {
      showSearchSidebar() {
        return this.$store.state.search.showSearchSidebar;
      }
    },
    watch: {
      showSearchSidebar(newVal) {
        if (newVal) {
          this.hideSearchSidebar = false;
        } else {
          setTimeout(() => this.hideSearchSidebar = true, 300);
        }
      }
    },
    created() {
      this.$store.commit('search/setShowSidebarToggle', true);
    },
    beforeDestroy() {
      this.$store.commit('search/setShowSidebarToggle', false);
    },
    methods: {
      toggleSearchSidebar() {
        this.$store.commit('search/setShowSearchSidebar', !this.$store.state.search.showSearchSidebar);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';
  @import '@europeana/style/scss/mixins';
  @import '@europeana/style/scss/transitions';

  .col-search-sidebar {
    flex-grow: 0;
    padding: 0;
    margin-top: -1rem;

    @media (max-width: ($bp-large - 1px)) {
      display: flex;
      position: fixed;
      right: 0;
      top: 0;
      bottom: 0;
      padding-top: 1rem;
      transition: right 300ms ease-in-out;
      z-index: 1050;
      max-width: none;
      overflow: hidden;

      .search-sidebar {
        flex-shrink: 0;
        margin-right: -320px;
        overflow-y: auto;
        width: 320px;
        max-width: 75vw;
        animation: appear 300ms ease-in-out;
        transition: margin-right 300ms ease-in-out;

        @keyframes appear {
          from {
            margin-right: -320px;
          }

          to {
            margin-right: 0;
          }
        }

        ::v-deep .search-dropdown {
          width: auto;
          margin-left: -15px;
          margin-right: -15px;

          .search-form {
            padding-left: 0;
            box-shadow: $boxshadow-light;

            &::before {
              content: '';
            }
          }
        }
      }

      &.hide {
        display: none;
      }

      &.open {
        left: 0;

        .search-sidebar {
          margin-right: 0;
        }

        .search-sidebar-backdrop {
          content: '';
          width: 100%;
          height: 100%;
          background-color: rgb(0 0 0 / 70%);
        }
      }
    }

    @media (min-width: $bp-large) {
      max-width: 320px;
      min-width: 220px;
      min-height: 31rem;
      box-shadow: $boxshadow-small;

      @include white-cutout;

      .search-sidebar-backdrop {
        display: none;
      }
    }

    @media (min-width: $bp-4k) {
      max-width: 480px;
      margin-top: -1.5rem;

      .col {
        padding-left: 1.5rem;
        padding-right: 1.5rem;
      }
    }

    .search-sidebar {
      background-color: $white;
      height: 100%;
    }

    .search-sidebar-header {
      border-bottom: 1px solid $middlegrey;
      height: 3.5rem;
    }

    .close-sidebar-button {
      font-weight: 600;
    }

    .query-builder-toggle {
      @media (min-width: $bp-large) {
        &::before {
          content: '<';
        }

        &.open::before {
          content: '>';
        }
      }
    }
  }
</style>
