<template>
  <header
    v-visible-on-scroll
    class="m-0 navbar-brand container-fluid d-flex justify-content-between show"
    role="banner"
    :aria-label="$t('header.europeanaHome')"
    data-qa="header"
  >
    <div
      v-if="showSearch"
      class="d-flex justify-content-center w-100"
    >
      <b-button
        data-qa="back button"
        class="button-icon icon-back"
        variant="light-flat"
        :aria-label="$t('header.backToMenu')"
        @click="toggleSearchBar"
      />
      <SearchForm
        role="search"
        aria-label="search form"
        data-qa="search form"
      />
    </div>
    <template
      v-else
    >
      <b-button
        v-b-toggle.sidebar
        variant="light-flat"
        class="navbar-toggle collapsed button-icon flex-column align-self-center ml-3"
        :aria-label="$t('header.showSidebar')"
        data-qa="hamburger button"
      >
        <span />
        <span />
        <span />
      </b-button>
      <SmartLink
        :destination="{ name: 'index' }"
        class="logo d-inline-flex"
      >
        <img
          src="../assets/img/logo.svg"
          :alt="$t('homeLinkAlt')"
          width="153"
          height="32"
          class="mw-100"
          data-qa="logo"
        >
      </SmartLink>
      <b-navbar
        class="align-items-center flex-row d-flex p-0 mr-3"
        role="navigation"
      >
        <PageNavigation
          class="d-none d-lg-flex"
          data-qa="top navigation"
        />
        <b-button
          data-qa="show search button"
          class="button-icon icon-search ml-lg-3"
          variant="light-flat"
          :aria-label="$t('search')"
          @click="toggleSearchBar"
        />
        <FilterToggleButton />
      </b-navbar>
      <b-sidebar
        id="sidebar"
        bg-variant="white"
        no-header
        backdrop
        backdrop-variant="black"
        aria-label="Side navigation"
      >
        <b-navbar
          class="sidebar-nav align-items-start flex-column pt-1 pl-2 pb-4 pr-2"
          role="navigation"
          data-qa="sidebar navigation"
        >
          <div class="w-100 d-flex align-items-center pl-2 pt-2 pb-3">
            <b-button
              v-b-toggle.sidebar
              data-qa="close menu button"
              class="button-icon icon-clear"
              variant="light-flat"
              :aria-label="$t('header.closeSidebar')"
            />
            <SmartLink
              :destination="{ name: 'index' }"
              class="logo pl-4 pr-2"
            >
              <img
                src="../assets/img/logo.svg"
                :alt="$t('homeLinkAlt')"
                width="153"
                height="32"
                class="mw-100"
                data-qa="logo"
              >
            </SmartLink>
          </div>
          <PageNavigation
            sidebar-nav
          />
          <div />
        </b-navbar>
      </b-sidebar>
    </template>
  </header>
</template>

<script>
  import SmartLink from './generic/SmartLink';
  import SearchForm from './search/SearchForm';
  import PageNavigation from './PageNavigation';
  import FilterToggleButton from '@/components/search/FilterToggleButton';
  import { mapState } from 'vuex';

  export default {
    name: 'PageHeader',

    components: {
      SmartLink,
      SearchForm,
      PageNavigation,
      FilterToggleButton
    },

    data() {
      return {
        windowWidth: 0
      };
    },

    computed: {
      ...mapState({ showSearch: state => state.search.showSearchBar      })
    },

    methods: {
      toggleSearchBar() {
        this.$store.commit('search/setShowSearchBar', !this.$store.state.search.showSearchBar);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';
  @import '@/assets/scss/icons';

  .container-fluid {
    background: $white;
    height: 3.5rem;
    position: fixed;
    right: 0;
    top: 0;
    left: 0;
    z-index: 1030;
    padding: 0;
    box-shadow: 2px 2px 4px 0 rgb(0 0 0 / 8%);

    &:not(.show) ::v-deep .search-query,
    &:not(.show) ::v-deep .auto-suggest-dropdown {
      display: none;
    }
  }

  .navbar-brand {
    min-width: 11.0625rem;
    flex: 0 0 auto;

    .logo {
      min-width: 9.5625rem;
      transition: 0.3s ease-in-out;

      img {
        margin: auto 0;
      }
    }
  }

  .navbar.sidebar-nav {
    .logo {
      min-width: auto;
    }

    .navbar-nav {
      flex-direction: column;
      width: 100%;
    }
  }

  .icon-back {
    position: absolute;
    left: 1rem;
    top: 1rem;
    z-index: 99;
  }

  .navbar-toggle {
    span {
      width: 1.125rem;
      background: $black;
      height: 2px;
      margin-bottom: 3px;
      transition: $standard-transition;
      &:last-of-type { margin-bottom: 0; }
    }

    &:hover {
      span {
        background: $innovationblue;
        transition: $standard-transition;
      }
    }
  }

  @media (min-width: $bp-medium) {
    .logo {
      margin: 0 auto 0 0;
      padding-left: 1.5rem;
    }
  }

  @media (min-width: $bp-large) {
    .navbar {
      position: relative;
      display: flex;
      height: auto;
      left: initial;
      top: initial;
      width: auto;
      padding: 0;

      .navbar-nav {
        padding-top: 0;
        flex-direction: row;
        width: 100%;
      }
    }

    .container-fluid {
      transition: $standard-transition;
    }
  }

  @media (min-width: $bp-extralarge) {
    .navbar-brand {
      .logo {
        min-width: 18.75rem;
      }
    }
  }

  .filters-toggle {
    @media (min-width: $bp-medium) {
      display: none;
    }
  }

</style>
